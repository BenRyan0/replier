import Tenant from '../models/Tenant.js';
import AutoReplyRecord from '../models/AutoReplyRecord.js';
import { renderTemplate, toHtml } from './templates.js';
import { sendReply } from './instantly.js';

const TEST_MODE = process.env.TEST_MODE === 'true';

// Matches common phone number formats so we don't mistake a phone for a company name.
const PHONE_RE = /^[\+\(]?\d[\d\s\-\(\)\.]{6,}$/;

function extractCompany(sheetData) {
  if (sheetData['Company Name']?.trim()) return sheetData['Company Name'].trim();
  const sig = sheetData['Email Signature'] || '';
  if (sig) {
    const lines = sig.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length >= 2 && !PHONE_RE.test(lines[1])) return lines[1];
  }
  return 'your business';
}

function validateBody(body) {
  const { replyData, classification, sheetData } = body;

  if (!replyData || !classification || !sheetData) {
    return 'Missing required top-level block: replyData, classification, or sheetData';
  }

  const { lead_email, email_account, email_id, reply_subject } = replyData;
  if (!lead_email || !email_account || !email_id || !reply_subject) {
    return 'replyData missing one of: lead_email, email_account, email_id, reply_subject';
  }

  const { category_id, sub_variant_id } = classification;
  if (!category_id || !sub_variant_id) {
    return 'classification missing one of: category_id, sub_variant_id';
  }
  if (typeof classification.auto_reply_allowed !== 'boolean') {
    return 'classification.auto_reply_allowed must be a boolean';
  }

  if (!sheetData['Lead First Name']) {
    return 'sheetData missing "Lead First Name"';
  }

  return null;
}

export async function receiveReply(req, res) {
  try {
    return await _receiveReply(req, res);
  } catch (err) {
    console.error(`  [500] unhandled exception — ${err.stack || err.message}`);
    return res.status(500).json({ success: false, error: `Unhandled error: ${err.message}` });
  }
}

async function _receiveReply(req, res) {
  console.log("req.body---------------------")
  console.log(req.body)
  const validationError = validateBody(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const { replyData, classification, sheetData, meta = {} } = req.body;
  const { lead_email, email_account, email_id, reply_subject, campaign_id } = replyData;
  const { category_id, sub_variant_id, auto_reply_allowed, extracted = {} } = classification;

  if (!auto_reply_allowed) {
    console.log(`  [skip] auto_reply_allowed=false for ${category_id}__${sub_variant_id}`);
    return res.status(200).json({ success: true, skipped: true, reason: 'auto_reply_allowed is false' });
  }

  // Personalization vars
  const name    = sheetData['Lead First Name'];
  const company = extractCompany(sheetData);
  const amount  = extracted.amount || extracted.value || '';
  console.log(`  [personalization] name="${name}" company="${company}" amount="${amount}"`);

  // Template lookup
  const plainText = renderTemplate(category_id, sub_variant_id, { name, company, amount });
  if (!plainText) {
    console.error(`  [500] template not found — key="${category_id}__${sub_variant_id}"`);
    return res.status(500).json({
      success: false,
      error: `Template not found for ${category_id}/${sub_variant_id}`,
    });
  }

  const bodyHtml = toHtml(plainText);

  // Tenant lookup — get Instantly API key + googleSheetId for AutoReplyRecord
  let instantlyApiKey = process.env.INSTANTLY_API_KEY || '';
  let googleSheetId   = '';

  try {
    const tenantSlug = (meta.tenantName || '').toLowerCase().replace(/\s+/g, '-');
    const tenant = await Tenant.findOne({ slug: tenantSlug }).lean();
    if (tenant) {
      instantlyApiKey = tenant.credentials?.instantlyApiKey || instantlyApiKey;
      googleSheetId   = tenant.googleSheetId || '';
      console.log(`  [tenant] found slug="${tenantSlug}" apiKey=${instantlyApiKey ? 'set' : 'missing'}`);
    } else {
      console.log(`  [tenant] not found slug="${tenantSlug}" — using env INSTANTLY_API_KEY (${instantlyApiKey ? 'set' : 'missing'})`);
    }
  } catch (err) {
    console.warn(`  [tenant] lookup error: ${err.message} — using env fallback`);
  }

  if (!instantlyApiKey) {
    console.error(`  [500] no Instantly API key — set INSTANTLY_API_KEY in .env or add tenant "${meta.tenantName}" to MongoDB`);
    return res.status(500).json({ success: false, error: 'No Instantly API key available' });
  }

  // Send (or log in test mode)
  if (TEST_MODE) {
    console.log('  [TEST MODE] would send via Instantly:');
    console.log(`    eaccount:      ${email_account}`);
    console.log(`    reply_to_uuid: ${email_id}`);
    console.log(`    subject:       ${reply_subject}`);
    console.log(`    body.text:\n${plainText.split('\n').map(l => '      ' + l).join('\n')}`);
  } else {
    try {
      await sendReply({
        apiKey:      instantlyApiKey,
        eaccount:    email_account,
        replyToUuid: email_id,
        subject:     reply_subject,
        bodyHtml,
        bodyText:    plainText,
      });
      console.log(`  [ok] reply sent via Instantly`);
    } catch (err) {
      const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.error(`  [500] Instantly API error — status=${err.response?.status ?? 'no response'} detail=${detail}`);
      return res.status(500).json({ success: false, error: `Instantly API error: ${detail}` });
    }
  }

  // Record the sent auto-reply so follow-up tracking can thread responses
  try {
    const existing = await AutoReplyRecord.findOne({ lead_email, campaign_id, isResolved: false });
    if (!existing) {
      await AutoReplyRecord.create({
        lead_email,
        campaign_id,
        googleSheetId,
        sheetName:      meta.sheetName      || '',
        sheetRowNumber: meta.sheetRowNumber  || 0,
        emailAccount:   email_account,
        replyEmailId:   email_id,
        replySubject:   reply_subject,
      });
    }
  } catch {
    // Non-fatal
  }

  return res.status(200).json({ success: true });
}
