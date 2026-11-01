import { ALLOWED_DOMAINS } from './sources';

const placeholder = /\b(placeholder|lorem ipsum|tbd|todo|awaiting (another |a |the )?story|no fifth story|additional.{0,40}story|not a news story|no story|story was supplied|requires inventing)\b/i;
const fields = ['title', 'publisher', 'url', 'publishedAt', 'category', 'summary', 'teachingMoment', 'caveat'] as const;
export type Story = Record<typeof fields[number], string> & { score: number };
export type Edition = { editionTitle: string; items: Story[] };

export function sourceUrl(value: string) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password ||
      url.port || !ALLOWED_DOMAINS.some(d => url.hostname === d || url.hostname.endsWith(`.${d}`)) ||
      url.pathname === '/' || /\b(example|placeholder|test)\b/i.test(url.pathname)) {
    throw new Error('Invalid story source URL');
  }
  url.hash = '';
  return url;
}

export function validateEdition(value: unknown, citedUrls: string[]): asserts value is Edition {
  const edition = value as Edition;
  if (!edition || typeof edition.editionTitle !== 'string' || !edition.editionTitle.trim() ||
      placeholder.test(edition.editionTitle) || !Array.isArray(edition.items) || edition.items.length !== 5) {
    throw new Error('Edition must contain a title and exactly five real stories');
  }
  const cited = new Set(citedUrls.map(url => { try { return sourceUrl(url).href; } catch { return ''; } }));
  const urls = new Set<string>();
  const titles = new Set<string>();
  for (const item of edition.items) {
    if (!item || fields.some(field => typeof item[field] !== 'string' || !item[field].trim() || placeholder.test(item[field])) ||
        typeof item.score !== 'number' || !Number.isFinite(item.score) || !Number.isFinite(Date.parse(item.publishedAt))) {
      throw new Error('Invalid or placeholder story content');
    }
    const url = sourceUrl(item.url);
    const title = item.title.trim().toLowerCase();
    const identity = `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`;
    if (!cited.has(url.href) || urls.has(identity) || titles.has(title)) {
      throw new Error('Story must have a unique URL and title and a Scout source citation');
    }
    urls.add(identity);
    titles.add(title);
  }
}

export async function validateStoryLinks(edition: Edition) {
  await Promise.all(edition.items.map(async item => {
    let url = sourceUrl(item.url);
    for (let redirects = 0; redirects <= 4; redirects++) {
      const response = await fetch(url, {
        redirect: 'manual', signal: AbortSignal.timeout(10_000),
        headers: { 'User-Agent': 'SignalAI-LinkValidator/1.0' },
      });
      await response.body?.cancel();
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) break;
        url = sourceUrl(new URL(location, url).href);
        continue;
      }
      if (response.ok && /text\/html|application\/pdf/i.test(response.headers.get('content-type') || '')) return;
      break;
    }
    throw new Error('Story URL could not be verified; refusing delivery');
  }));
}
