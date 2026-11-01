# Automated weekly production delivery

Signal AI starts generation every Monday at 08:00 Europe/London and sends the validated edition immediately afterwards. Generation and validation take time, so inbox arrival is shortly after 08:00.

## Deployment configuration

1. Keep the existing Resend subscriber segment; use its ID as `RESEND_SEGMENT_ID`.
2. Verify your sender domain in Resend and set `RESEND_FROM`. The Resend API key needs full access: delivery lists, creates, sends and removes broadcasts, and signups create contacts. Preserve `RESEND_TOPIC_ID` if you already use a topic.
3. Set `OPENROUTER_API_KEY`, `RESEND_API_KEY`, and a strong random `CRON_SECRET` in Vercel Production environment variables. Never commit their values. See `.env.example` for names only.
4. Set `ENABLE_PAID_AUTOMATION=true` and `PORTFOLIO_MODE=false` in Production. Missing credentials or disabled flags prevent delivery.
5. Deploy the updated application and `vercel.json`. Remove any previous external scheduled tasks that generate or send the same newsletter.

Vercel cron uses UTC. Two separate Monday cron entries run at 07:00 and 08:00 UTC; the handler permits only the one falling in the 08:00 UK hour. This handles GMT and BST automatically. Vercel Hobby can invoke anywhere within the scheduled hour; use a plan with minute-level cron precision for an 08:00 start. Cron timing and inbox delivery are not exact guarantees.

## Validation and delivery

The existing OpenRouter Scout and Critic pipeline searches the preceding seven days. Before creating a broadcast it requires exactly five distinct stories, populated fields, a parseable publication date, no detected placeholder text, allowlisted article URLs, and Scout URL citations. It checks article links with bounded redirects, rejects redirects outside the source pool, and requires successful HTML/PDF responses. A blocked, unavailable or unverifiable URL cancels the edition. These checks reduce fabrication risk but cannot prove every factual claim in generated prose.

The HTML renderer escapes generated content and preserves `{{{RESEND_UNSUBSCRIBE_URL}}}`. Delivery uses Resend Broadcasts with the existing segment and optional topic, preserving Resend's unsubscribe filtering. No individual subscriber email loop is introduced.

## Duplicate protection and recovery

Each edition's Resend Broadcast is named `signal-ai:weekly:YYYY-MM-DD` for its London Monday date, and that name is the duplicate record. A run that finds a broadcast with this week's name, in any status, stops before generating. If Resend's broadcast list is unavailable, nothing is generated or sent.

Generation takes minutes, so concurrent runs can all pass that first check. After creating its draft each run lists the edition's broadcasts again: only the earliest sends, and the others remove their own drafts. This relies on Resend's list showing a newly created broadcast straight away, so it is not a strict atomic lock. A run whose own broadcast is missing from the list does not send.

Generation, validation or draft-creation failures log the failing stage and remove any unsent draft, so nothing blocks a retry. Vercel does not automatically retry failed cron invocations; an operator can retry the authenticated endpoint during the Monday 08:00 UK hour after fixing the cause.

Any send error, timeout or process termination leaves the broadcast in place, which blocks that week permanently. This deliberately favours preventing duplicate email over automatic retry. Inspect that exact broadcast in Resend before any manual recovery: if it is still an unsent draft, send it from the Resend dashboard, or delete it and rerun during the delivery hour. Never delete or rename a sent or queued broadcast from the current week to rerun the job, because that removes its duplicate protection.

Logs identify the week, failed stage and whether sending was attempted, without logging provider payloads or credentials. A successful response means Resend accepted the broadcast, not that every inbox has received it.

## Verification

Run `npm test`, `npm run typecheck` and `npm run build`. Automated tests mock provider calls and never send email or consume model credits. Before launch, verify a test subscription and unsubscribe using your Resend account.
