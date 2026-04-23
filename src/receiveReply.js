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
    if (Array.isArray(req.body)) {
      if (req.body.length === 0) {
        return res.status(400).json({ success: false, error: 'Request array is empty' });
      }
      const results = await Promise.all(
        req.body.map((item, i) => _processItem(item, i))
      );
      const allFailed = results.every(r => !r.success && r.status >= 500);
      const statusCode = allFailed ? 500 : 200;
      return res.status(statusCode).json(results);
    }
    return await _receiveReply(req, res);
  } catch (err) {
    console.error(`  [500] unhandled exception — ${err.stack || err.message}`);
    return res.status(500).json({ success: false, error: `Unhandled error: ${err.message}` });
  }
}

async function _processItem(body, index) {
  const label = `[item ${index}]`;
  try {
    const result = await _handlePayload(body, label);
    return result;
  } catch (err) {
    console.error(`  ${label} [500] unhandled exception — ${err.stack || err.message}`);
    return { success: false, status: 500, error: `Unhandled error: ${err.message}` };
  }
}

async function _receiveReply(req, res) {
  console.log("req.body---------------------")
  console.log(req.body)
  const result = await _handlePayload(req.body, '');
  return res.status(result.status).json(
    result.status === 200
      ? (result.skipped ? { success: true, skipped: true, reason: result.reason } : { success: true })
      : { success: false, error: result.error }
  );
}

async function _handlePayload(body, label) {
  const p = label ? `  ${label}` : ' ';

  const validationError = validateBody(body);
  if (validationError) {
    return { success: false, status: 400, error: validationError };
  }

  const { replyData, classification, sheetData, meta = {} } = body;
  const { lead_email, email_account, email_id, reply_subject, campaign_id } = replyData;
  const { category_id, sub_variant_id, auto_reply_allowed, extracted = {} } = classification;

  if (!auto_reply_allowed) {
    console.log(`${p} [skip] auto_reply_allowed=false for ${category_id}__${sub_variant_id}`);
    return { success: true, status: 200, skipped: true, reason: 'auto_reply_allowed is false' };
  }

  // Dedup: if a resolved record exists for this lead+campaign, the conversation
  // is closed — do not send another auto-reply.
  try {
    const resolved = await AutoReplyRecord.findOne({ lead_email, campaign_id, isResolved: true }).lean();
    if (resolved) {
      console.log(`${p} [skip] resolved AutoReplyRecord exists for lead=${lead_email} campaign=${campaign_id}`);
      return { success: true, status: 200, skipped: true, reason: 'lead already resolved' };
    }
  } catch (err) {
    console.warn(`${p} [dedup] lookup error: ${err.message} — proceeding`);
  }

  const name    = sheetData['Lead First Name'];
  const company = extractCompany(sheetData);
  const amount  = extracted.amount || extracted.value || '';
  console.log(`${p} [personalization] name="${name}" company="${company}" amount="${amount}"`);

  const plainText = renderTemplate(category_id, sub_variant_id, { name, company, amount });
  if (!plainText) {
    console.error(`${p} [500] template not found — key="${category_id}__${sub_variant_id}"`);
    return { success: false, status: 500, error: `Template not found for ${category_id}/${sub_variant_id}` };
  }

  const bodyHtml = toHtml(plainText);

  let instantlyApiKey = process.env.INSTANTLY_API_KEY || '';
  let googleSheetId   = '';

  try {
    const tenantSlug = (meta.tenantName || '').toLowerCase().replace(/\s+/g, '-');
    const tenant = await Tenant.findOne({ slug: tenantSlug }).lean();
    if (tenant) {
      instantlyApiKey = tenant.credentials?.instantlyApiKey || instantlyApiKey;
      googleSheetId   = tenant.googleSheetId || '';
      console.log(`${p} [tenant] found slug="${tenantSlug}" apiKey=${instantlyApiKey ? 'set' : 'missing'}`);
    } else {
      console.log(`${p} [tenant] not found slug="${tenantSlug}" — using env INSTANTLY_API_KEY (${instantlyApiKey ? 'set' : 'missing'})`);
    }
  } catch (err) {
    console.warn(`${p} [tenant] lookup error: ${err.message} — using env fallback`);
  }

  if (!instantlyApiKey) {
    console.error(`${p} [500] no Instantly API key — set INSTANTLY_API_KEY in .env or add tenant "${meta.tenantName}" to MongoDB`);
    return { success: false, status: 500, error: 'No Instantly API key available' };
  }

  if (TEST_MODE) {
    console.log(`${p} [TEST MODE] would send via Instantly:`);
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
      console.log(`${p} [ok] reply sent via Instantly`);
    } catch (err) {
      const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.error(`${p} [500] Instantly API error — status=${err.response?.status ?? 'no response'} detail=${detail}`);
      return { success: false, status: 500, error: `Instantly API error: ${detail}` };
    }
  }

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

  return { success: true, status: 200 };
}
