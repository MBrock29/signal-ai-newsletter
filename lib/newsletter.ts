import OpenAI from 'openai';
import { ALLOWED_DOMAINS, SOURCES } from './sources';
import { DISCOVERY_PROMPT, CRITIC_PROMPT } from './prompts';
import { newsletterSchema } from './schema';

function getClient() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required only for optional production generation. Portfolio mode needs no key.');
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function extractUrls(response:any) {
  const urls:any[] = [];
  for (const item of response.output || []) {
    if (item.type !== 'message') continue;
    for (const c of item.content || []) {
      for (const a of c.annotations || []) {
        if (a.type === 'url_citation') urls.push({url:a.url,title:a.title});
      }
    }
  }
  return urls;
}

export async function buildEdition() {
  if (process.env.PORTFOLIO_MODE !== 'false') {
    throw new Error('Generation is disabled in PORTFOLIO_MODE so the demo cannot incur API costs.');
  }

  const openai = getClient();
  const discovery = await openai.responses.create({
    model:'gpt-6-luna',
    reasoning:{effort:'medium'},
    tools:[{type:'web_search', filters:{allowed_domains:ALLOWED_DOMAINS}, search_context_size:'medium'} as any],
    tool_choice:'required',
    input:`${DISCOVERY_PROMPT}\nToday is ${new Date().toISOString()}. Source priors:\n${JSON.stringify(SOURCES)}`
  });

  const cited = extractUrls(discovery);
  const judged = await openai.responses.create({
    model:'gpt-6.1-sol',
    reasoning:{effort:'high'},
    input:`${CRITIC_PROMPT}\n\nCandidates:\n${discovery.output_text}\n\nCited URLs from discovery:\n${JSON.stringify(cited)}\n\nSource priors:\n${JSON.stringify(SOURCES)}`,
    text:{format:{type:'json_schema',name:'newsletter_edition',strict:true,schema:newsletterSchema as any}}
  });

  return JSON.parse(judged.output_text);
}

export function renderHtml(edition:any) {
  const items = edition.items.map((x:any,i:number)=>`<section style="margin:0 0 48px"><div style="font:600 12px Arial;color:#697386;text-transform:uppercase;letter-spacing:.08em">${i+1} · ${x.publisher} · ${x.category}</div><h2 style="font:700 26px Arial;margin:8px 0"><a href="${x.url}" style="color:#111827;text-decoration:none">${x.title}</a></h2><div style="font:14px Arial;color:#6b7280;margin-bottom:14px">${x.publishedAt} · editor score ${x.score}/30</div><p style="font:16px/1.65 Arial;color:#1f2937">${x.summary}</p><p style="font:16px/1.65 Arial;color:#1f2937"><b>What you can learn:</b> ${x.teachingMoment}</p><p style="font:15px/1.6 Arial;color:#4b5563"><b>Caveat:</b> ${x.caveat}</p><p><a href="${x.url}">Read the original →</a></p></section>`).join('');
  return `<div style="max-width:700px;margin:auto;padding:32px 18px;background:#fff"><div style="font:700 13px Arial;letter-spacing:.14em">SIGNAL AI</div><h1 style="font:700 36px Arial;margin:8px 0 6px">${edition.editionTitle}</h1><p style="font:16px Arial;color:#6b7280;margin:0 0 40px">Five worthwhile AI reads. About 15 minutes.</p>${items}<hr style="border:0;border-top:1px solid #e5e7eb"><p style="font:12px Arial;color:#6b7280">You subscribed to Signal AI. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>.</p></div>`;
}
