import axios from 'axios';

/**
 * Send a reply via the Instantly v2 API.
 *
 * @param {object} opts
 * @param {string} opts.apiKey        Instantly API key (Bearer token)
 * @param {string} opts.eaccount      Sending email account
 * @param {string} opts.replyToUuid   email_id of the lead's original reply (reply_to_uuid)
 * @param {string} opts.subject       Subject line
 * @param {string} opts.bodyHtml      Rendered HTML body
 * @param {string} opts.bodyText      Rendered plain-text body
 */
export async function sendReply({ apiKey, eaccount, replyToUuid, subject, bodyHtml, bodyText }) {
  const url = 'https://api.instantly.ai/api/v2/emails/reply';

  const payload = {
    eaccount,
    reply_to_uuid: replyToUuid,
    subject,
    body: {
      html: bodyHtml,
      text: bodyText,
    },
  };

  const { data } = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  return data;
}
