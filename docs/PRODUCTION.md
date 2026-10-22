# Production setup

Signal AI deliberately separates **real subscriber capture** from **paid AI automation**.

## Production v1 (recommended, £0 incremental AI cost)

1. Deploy the Next.js app to Vercel Hobby.
2. Create a free Resend account.
3. Create a Segment named `Signal AI Subscribers`.
4. Create an API key with the minimum permissions required to create/manage contacts.
5. Add these Vercel Production environment variables:
   - `RESEND_API_KEY`
   - `RESEND_SEGMENT_ID`
   - `ENABLE_PAID_AUTOMATION=false`
6. Redeploy.
7. Submit a test address on the live site and verify it appears in the Resend Segment.
8. Generate each edition using the ChatGPT scheduled task.
9. Create a Resend Broadcast for the Segment, paste the finished edition, include Resend's unsubscribe placeholder/link, preview it, then send/schedule it.

This version stores real subscribers and can deliver newsletters while avoiding OpenAI API charges.

## Before public launch

- Verify a sender domain in Resend and configure SPF/DKIM/DMARC as directed by Resend.
- Keep signup wording explicit: the user is subscribing to a twice-weekly newsletter.
- Include an unsubscribe link in every Broadcast.
- Test mobile layout and the `/example` and `/privacy` pages.
- Confirm a repeated signup does not produce a broken experience.
- Enable Vercel's built-in WAF / abuse protections as appropriate.
- Test a bounce/unsubscribe in Resend before sharing publicly.

## Future fully automated version

Only when desired, add `OPENAI_API_KEY`, `CRON_SECRET`, `NEWSLETTER_FROM`, and set `ENABLE_PAID_AUTOMATION=true`. At that point the generation/delivery route can be wired to Resend Broadcasts. Until then, the route refuses to make paid model calls.
