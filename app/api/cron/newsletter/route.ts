import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildEdition, renderHtml } from '../../../../lib/newsletter';
import { deliverySlot, discardDraft, editionBroadcasts } from '../../../../lib/delivery';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (process.env.ENABLE_PAID_AUTOMATION !== 'true' || process.env.PORTFOLIO_MODE !== 'false') {
    return NextResponse.json({ ok: false, error: 'Automation is disabled' }, { status: 503 });
  }
  const { due, editionKey } = deliverySlot();
  if (!due) return NextResponse.json({ ok: true, status: 'outside_delivery_window' });
  const required = ['OPENROUTER_API_KEY', 'RESEND_API_KEY', 'RESEND_SEGMENT_ID', 'RESEND_FROM'] as const;
  const missing = required.filter(name => !process.env[name]);
  if (missing.length) {
    console.error('Signal AI: missing configuration', missing);
    return NextResponse.json({ ok: false, error: 'Missing newsletter configuration' }, { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY!);
  let broadcastId: string | undefined;
  let sendAttempted = false;
  let stage = 'duplicate_check';
  try {
    if ((await editionBroadcasts(resend, editionKey)).length) {
      return NextResponse.json({ ok: true, status: 'already_claimed', editionKey });
    }
    stage = 'generation_and_validation';
    const edition = await buildEdition();
    const html = renderHtml(edition);
    stage = 'broadcast_creation';
    const { data, error } = await resend.broadcasts.create({
      name: editionKey,
      segmentId: process.env.RESEND_SEGMENT_ID!,
      from: process.env.RESEND_FROM!,
      subject: 'Signal AI: 5 AI reads worth your time',
      html,
      ...(process.env.RESEND_TOPIC_ID ? { topicId: process.env.RESEND_TOPIC_ID } : {}),
      previewText: 'Five worthwhile AI reads. About 15 minutes.',
    });
    if (error || !data?.id) throw new Error('Broadcast creation failed');
    broadcastId = data.id;
    // A concurrent run may have passed the first check during generation: only the
    // earliest broadcast sends. Our own being absent means the check can't be trusted.
    stage = 'duplicate_recheck';
    const copies = await editionBroadcasts(resend, editionKey);
    if (!copies.some(copy => copy.id === broadcastId)) throw new Error('Created broadcast is not listed');
    if (copies[0].id !== broadcastId) {
      await discardDraft(resend, broadcastId);
      return NextResponse.json({ ok: true, status: 'already_claimed', editionKey });
    }
    // Never discard after a send attempt: a timeout may mean Resend accepted it.
    sendAttempted = true;
    stage = 'broadcast_send';
    const sent = await resend.broadcasts.send(broadcastId);
    if (sent.error || !sent.data) throw new Error('Broadcast send failed or outcome is unknown');
    console.log('Signal AI: broadcast accepted', { editionKey, broadcastId });
    return NextResponse.json({ ok: true, status: 'sent', editionKey, broadcastId, items: 5 });
  } catch {
    // Do not log provider payloads, headers or credentials.
    console.error('Signal AI: newsletter failed', { editionKey, stage, sendAttempted });
    if (broadcastId && !sendAttempted) {
      try { await discardDraft(resend, broadcastId); }
      catch { console.error('Signal AI: draft removal failed', { editionKey, broadcastId }); }
    }
    return NextResponse.json({ ok: false, error: 'Newsletter failed; inspect server logs', stage }, { status: 500 });
  }
}
