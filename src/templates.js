// Keys follow the pattern {category_id}__{sub_variant_id} — matching exactly
// what the upstream classifier sends in classification.category_id / sub_variant_id.

const SIGN_TALK  = 'Talk soon,\nLinda Lopez\nSenior Underwriter, Luna Lending';
const SIGN_BEST  = 'Wishing you the best,\nLinda Lopez\nSenior Underwriter, Luna Lending';
const SIGN_PLAIN = 'Linda Lopez\nSenior Underwriter, Luna Lending';

const templates = {

  // ── stated_amount ────────────────────────────────────────────────────────────

  stated_amount__primary: ({ name, company, amount }) =>
`Hi ${name},

${amount} works. I can get ${company} an offer put together today.

Apply at https://www.lunalend.com/apply and upload your last 4 months of bank statements. I'll have term loan and line of credit options to you in a couple hours.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. You get funded in 4 to 24 hours once you accept.

${SIGN_TALK}`,

  stated_amount__range: ({ name, company }) =>
`Hi ${name},

That range works well for ${company}. I can put a few options together so you pick what fits best.

Apply at https://www.lunalend.com/apply and upload your last 4 months of bank statements. I'll have term loan and line of credit options ready in a couple hours.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. Funding lands 4 to 24 hours after you accept.

${SIGN_TALK}`,

  stated_amount__small: ({ name, company, amount }) =>
`Hi ${name},

${amount} is on the smaller end. We still fund at that level, so let me see what comes back for ${company}.

Apply at https://www.lunalend.com/apply with your last 4 months of bank statements. I'll reach out with your options shortly.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. You get funded in 4 to 24 hours once you accept.

${SIGN_TALK}`,

  stated_amount__large: ({ name, company, amount }) =>
`Hi ${name},

${amount} is very doable. We fund at that level all the time and ${company} is in solid shape to get a real offer.

Apply at https://www.lunalend.com/apply and upload your last 4 months of bank statements. I put extra attention into the underwriting at higher amounts. The offer will be back to you in a few hours.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. You get funded in 4 to 24 hours once you accept.

${SIGN_TALK}`,

  stated_amount__unclear: ({ name, company }) =>
`Hi ${name},

I can build the maximum offer ${company} qualifies for. Your bank statements tell me exactly what that number looks like.

Apply at https://www.lunalend.com/apply and upload your last 4 months. I'll have a term loan and line of credit offer to you in a couple hours.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. Funding in 4 to 24 hours once you accept.

${SIGN_TALK}`,

  // ── interested ───────────────────────────────────────────────────────────────

  interested__primary: ({ name, company }) =>
`Hi ${name},

How much funding is ${company} looking for? That lets me size the offer correctly.

You can also start the app now at https://www.lunalend.com/apply. Upload your last 4 months of bank statements and I'll have term loan and line of credit options to you in a couple hours.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. Funding lands 4 to 24 hours after you accept.

${SIGN_TALK}`,

  interested__revenue_short: ({ name, company }) =>
`Hi ${name},

Revenue is the main thing we look at but it is not a hard cutoff. We look at the full picture of your bank activity, not one number on a form.

Apply at https://www.lunalend.com/apply with your last 4 months of statements. Let me see what is actually there for ${company} and I will give you a straight answer.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. Funding is 4 to 24 hours once you accept.

${SIGN_TALK}`,

  interested__no_statements: ({ name, company }) =>
`Hi ${name},

We do require a minimum of 3 months of bank statements for the application to go through. If ${company} is not quite there yet, it may be worth waiting until next month before submitting so you come in with the strongest application possible.

If you already have 3 months or more, upload them at https://www.lunalend.com/apply and I will take a look at what is there.

Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  // ── needs_more_info ──────────────────────────────────────────────────────────

  needs_more_info__primary: ({ name, company }) =>
`Hi ${name},

Here is how it works for ${company}. You need at least $8K a month in revenue to qualify. Offers go up to $1,000,000. You pick a term loan or a line of credit with terms from 3 months to 3 years. You upload your last 4 months of bank statements. I come back with offers in a couple hours.

Start at https://www.lunalend.com/apply.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. You get funded in 4 to 24 hours once you accept.

Any questions, just ask.

${SIGN_TALK}`,

  needs_more_info__grant: ({ name, company }) =>
`Hi ${name},

Not a grant. This is a business loan that ${company} pays back over time. Term loan or line of credit, your choice. Terms run from 3 months to 3 years. We work with businesses doing $8K or more a month in revenue and offers go up to $1M.

Apply at https://www.lunalend.com/apply with your last 4 months of bank statements. Luna Lending is a direct lender. Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  needs_more_info__nonprofit: ({ name, company }) =>
`Hi ${name},

We do fund nonprofits, so ${company} can qualify. One thing to know upfront. This is a loan, not a grant. You pay it back over time with terms from 3 months to 3 years.

What we care about is cash flow. If ${company} has steady revenue coming in from programs, services, donations, or grants, we can work with that. Mission type does not affect your eligibility.

Apply at https://www.lunalend.com/apply with your last 4 months of bank statements. Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. You get funded in 4 to 24 hours once you accept.

${SIGN_TALK}`,

  needs_more_info__next_steps: ({ name, company }) =>
`Hi ${name},

Here is exactly what happens. You submit bank statements at https://www.lunalend.com/apply. I come back with term loan and line of credit offers in a couple hours. You pick what works for ${company}. We wire the funding to your account in 4 to 24 hours.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected at any point.

${SIGN_TALK}`,

  needs_more_info__no_statements: ({ name, company }) =>
`Hi ${name},

We do require a minimum of 3 months of bank statements for the application to go through. If ${company} is not there yet, it may be worth waiting until next month before submitting so your application has the best shot.

If you already have 3 months or more, go ahead and upload them at https://www.lunalend.com/apply. If the history is solid the deposits will speak for themselves.

Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  needs_more_info__phone_call: ({ name, company }) =>
`Hi ${name},

Submit the app first at https://www.lunalend.com/apply. That way I have real numbers for ${company} when we talk, not ballpark figures. Upload your last 4 months of statements. Takes about 5 minutes. Then I call you with an actual offer.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. Funding is 4 to 24 hours after you accept.

${SIGN_TALK}`,

  needs_more_info__verify_legit: ({ name, company }) =>
`Hi ${name},

All our info is at https://www.lunalend.com/apply. Take a look whenever you are ready. When you want to move forward, upload ${company}'s last 4 months of bank statements and I will put an offer together.

Luna Lending is a direct lender. Soft pull only so your credit will not be affected even if you decide not to move forward.

${SIGN_TALK}`,

  // ── asking_questions ─────────────────────────────────────────────────────────

  asking_questions__legitimacy: ({ name, company }) =>
`Hi ${name},

Luna Lending has been a direct lender since 2006. Over 2,500 businesses funded and more than $1B secured. You can verify that at https://www.lunalend.com/apply.

When you are ready, upload ${company}'s last 4 months of bank statements. Soft pull only so your credit score will not be affected. You get an actual offer back in a couple hours with no obligation.

${SIGN_TALK}`,

  asking_questions__rate_skepticism: ({ name, company }) =>
`Hi ${name},

Nobody lends at 0% and I would tell ${company} to walk if someone offered that. Our APR runs from 5% to 49% depending on your profile. I give you the real number once I see your bank statements, not a number designed to get you to click apply.

Apply at https://www.lunalend.com/apply with your last 4 months of statements. Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. You see an actual offer before you commit to anything.

${SIGN_TALK}`,

  asking_questions__how_got_info: ({ name, company }) =>
`Hi ${name},

Your contact info came through a business outreach list. We reach out to business owners who may qualify for funding. That is how ${company} ended up on our radar.

If you want us to stop reaching out, just say the word and I will take you off right now. No hard feelings at all.

If you are open to hearing what we can offer, apply at https://www.lunalend.com/apply. Luna Lending is a direct lender. Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  asking_questions__credit_concern: ({ name, company }) =>
`Hi ${name},

We do not approve on credit score. We approve on ${company}'s revenue and bank activity. We fund businesses with scores as low as 500.

Apply at https://www.lunalend.com/apply with your last 4 months of bank statements. Luna Lending is a direct lender. Soft pull only so your credit score will not be affected by checking.

${SIGN_TALK}`,

  asking_questions__why_pull_credit: ({ name, company }) =>
`Hi ${name},

It is a soft pull, not a hard inquiry. Your credit score will not move. It does not show on reports that lenders see. We use it to verify identity, nothing else.

Apply at https://www.lunalend.com/apply with ${company}'s last 4 months of bank statements. Luna Lending is a direct lender.

${SIGN_TALK}`,

  asking_questions__product_type: ({ name, company }) =>
`Hi ${name},

Both. Once I see ${company}'s bank statements I put together options for each and you pick what works. Term loans fit single purchase needs like equipment or inventory. Lines of credit fit ongoing cash flow needs.

Apply at https://www.lunalend.com/apply with your last 4 months of bank statements. Soft pull only so your credit score will not be affected. Luna Lending is a direct lender.

${SIGN_TALK}`,

  asking_questions__location_banks: ({ name, company }) =>
`Hi ${name},

We are a direct lender based in the US. We fund businesses across all 50 states and work with all major US banks. Whatever bank ${company} uses is fine.

Apply at https://www.lunalend.com/apply with your last 4 months of statements. Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  asking_questions__rates_terms: ({ name, company }) =>
`Hi ${name},

Rates are based on your business profile so I do not quote a number before I see your statements. What I can tell you right now is that our APR runs from 5% to 49% and repayment terms run from 3 months to 3 years. Where ${company} lands in that range depends on your monthly revenue and how your bank activity looks.

Upload your last 4 months of bank statements at https://www.lunalend.com/apply and I will come back with your actual rate and terms in a couple hours. No estimates, no bait numbers.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  asking_questions__documents: ({ name, company }) =>
`Hi ${name},

Business bank statements only, not personal. Just ${company}'s last 4 months from your business account.

Upload at https://www.lunalend.com/apply. Offers back in a couple hours. Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  // ── completed_app ────────────────────────────────────────────────────────────

  completed_app__primary: ({ name, company }) =>
`Hi ${name},

I have ${company}'s statements. I'll come back with term loan and line of credit options in a couple hours. If I need anything else I'll reach out.

Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. You get funded in 4 to 24 hours once you pick an offer.

${SIGN_TALK}`,

  completed_app__timing: ({ name, company }) =>
`Hi ${name},

I have ${company}'s application in hand. I'll review and come back with your options in a couple hours. No appointment needed, I will reach out as soon as they are ready.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. Funding is 4 to 24 hours after you accept.

${SIGN_TALK}`,

  completed_app__with_amount: ({ name, company, amount }) =>
`Hi ${name},

${amount} noted. I have ${company}'s application and I'll build the offer around that number. Back to you in a couple hours.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. Funding is 4 to 24 hours after you accept.

${SIGN_TALK}`,

  // ── not_interested ───────────────────────────────────────────────────────────

  not_interested__primary: ({ name }) =>
`Hi ${name},

Noted. If anything changes, we are at https://www.lunalend.com/apply. Soft pull only so checking your options never affects your credit.

Wishing you the best.

${SIGN_PLAIN}`,

  not_interested__startup: ({ name, company }) =>
`Hi ${name},

Come back when ${company} is consistently at $8K a month or more. We are at https://www.lunalend.com/apply and I will put an offer together. Soft pull only so your credit score will never be affected.

${SIGN_BEST}`,

  not_interested__grants: ({ name, company }) =>
`Hi ${name},

We do not do grants. If ${company} ever needs bridge funding while the grant search runs long, we are at https://www.lunalend.com/apply. Soft pull only so checking never affects your credit.

${SIGN_BEST}`,

  not_interested__optout: ({ name }) =>
`Hi ${name},

Removing you now. You will not hear from me again. If you ever need funding, we are at https://www.lunalend.com/apply.

${SIGN_PLAIN}`,

  not_interested__hostile: ({ name }) =>
`Hi ${name},

File closed on my end. If anything changes, we are at https://www.lunalend.com/apply.

${SIGN_PLAIN}`,

  not_interested__scam_accusation: ({ name }) =>
`Hi ${name},

Luna Lending has been a direct lender since 2006. Over 2,500 businesses funded and more than $1B secured. All of it is verifiable at https://www.lunalend.com/apply.

If you ever want to look at an actual offer with no obligation, soft pull only means your credit score will not be affected.

${SIGN_PLAIN}`,

  // ── irrelevant ───────────────────────────────────────────────────────────────

  irrelevant__primary: ({ name, company }) =>
`Hi ${name},

Is ${company} looking for business funding? If so, I can have an offer together in a couple hours.

Apply at https://www.lunalend.com/apply with your last 4 months of bank statements. Luna Lending is a direct lender. Soft pull only so your credit score will not be affected. Funding in 4 to 24 hours after you accept.

${SIGN_TALK}`,

  irrelevant__confused: ({ name, company }) =>
`Hi ${name},

I'm Linda with Luna Lending. We are a direct lender for term loans and lines of credit, usually funded in 4 to 24 hours. ${company} qualifies on monthly revenue, $8K or more, not credit score.

Apply at https://www.lunalend.com/apply and upload your last 4 months of bank statements. I'll come back with options in a couple hours.

Soft pull only so your credit score will not be affected.

${SIGN_TALK}`,

  irrelevant__rambling: ({ name, company }) =>
`Hi ${name},

The fastest way I can help ${company} is to see your bank statements. That tells me exactly what offer I can put together.

Apply at https://www.lunalend.com/apply with your last 4 months. I'll have term loan and line of credit options in a couple hours.

Soft pull only so your credit score will not be affected. Luna Lending is a direct lender. Funding in 4 to 24 hours after you accept.

${SIGN_TALK}`,

  irrelevant__non_us: ({ name, company }) =>
`Hi ${name},

We fund US-based businesses only. If ${company} is not registered in the US, we are not a fit. If that changes, we are at https://www.lunalend.com/apply.

${SIGN_PLAIN}`,

  irrelevant__low_revenue: ({ name, company }) =>
`Hi ${name},

$8K a month is the bar but apply anyway at https://www.lunalend.com/apply. Submit ${company}'s bank statements and let them tell the real story. Some businesses are closer than they think.

Soft pull only so your credit score will not be affected either way.

${SIGN_TALK}`,
  // ── legacy key aliases (old keys kept so either name works) ─────────────────

  needs_more_info__legitimacy:   (...a) => templates.needs_more_info__verify_legit(...a),
  asking_questions__scam:        (...a) => templates.asking_questions__legitimacy(...a),
  asking_questions__skeptical:   (...a) => templates.asking_questions__rate_skepticism(...a),
  asking_questions__info_source: (...a) => templates.asking_questions__how_got_info(...a),
  asking_questions__bad_credit:  (...a) => templates.asking_questions__credit_concern(...a),
  asking_questions__why_credit:  (...a) => templates.asking_questions__why_pull_credit(...a),
  asking_questions__loan_type:   (...a) => templates.asking_questions__product_type(...a),
  asking_questions__location:    (...a) => templates.asking_questions__location_banks(...a),
  asking_questions__rates:       (...a) => templates.asking_questions__rates_terms(...a),
  completed_app__amount:         (...a) => templates.completed_app__with_amount(...a),
  not_interested__low_revenue:   (...a) => templates.not_interested__startup(...a),
};

/**
 * Render a reply template.
 *
 * @param {string} categoryId
 * @param {string} subVariantId
 * @param {{ name: string, company: string, amount: string }} vars
 * @returns {string|null} Rendered plain-text body, or null if template not found.
 */
export function renderTemplate(categoryId, subVariantId, vars) {
  const key = `${categoryId}__${subVariantId}`;
  const tpl = templates[key];
  return tpl ? tpl(vars) : null;
}

/**
 * Convert a plain-text template body to HTML suitable for email.
 * Blank lines become paragraph breaks; single newlines become <br>.
 * URLs become clickable anchor tags.
 */
const URL_RE = /https?:\/\/[^\s<]+/g;

export function toHtml(text) {
  return text
    .split('\n\n')
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('\n')
    .replace(URL_RE, url => {
      const clean = url.replace(/[.,;:!?)]+$/, '');
      const tail  = url.slice(clean.length);
      return `<a href="${clean}" target="_blank">${clean}</a>${tail}`;
    });
}
