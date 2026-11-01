import type { Resend } from 'resend';

// A broadcast named after the edition key marks that week as claimed, whatever its
// status: an interrupted send must not be retried automatically, since the provider
// may already have accepted it.
export function deliverySlot(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', weekday: 'short', year: 'numeric',
    month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (name: string) => parts.find(p => p.type === name)?.value;
  return {
    due: part('weekday') === 'Mon' && part('hour') === '08',
    editionKey: `signal-ai:weekly:${part('year')}-${part('month')}-${part('day')}`,
  };
}

// Returns this edition's broadcasts, earliest first, so concurrent runs agree on a winner.
export async function editionBroadcasts(resend: Resend, editionKey: string) {
  const matches = [];
  let after: string | undefined;
  do {
    const { data, error } = await resend.broadcasts.list({ limit: 100, ...(after ? { after } : {}) });
    if (error || !data) throw new Error('Broadcast list request failed');
    matches.push(...data.data.filter(broadcast => broadcast.name === editionKey));
    after = data.has_more ? data.data.at(-1)?.id : undefined;
  } while (after);
  return matches.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
}

export async function discardDraft(resend: Resend, broadcastId: string) {
  const { error } = await resend.broadcasts.remove(broadcastId);
  if (error) throw new Error('Broadcast removal failed');
}
