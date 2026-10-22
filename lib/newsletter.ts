import OpenAI from 'openai';
import { SOURCES } from './sources';
import { DISCOVERY_PROMPT, CRITIC_PROMPT } from './prompts';
import { newsletterSchema } from './schema';

function getClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is required');
  }

  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    timeout: 180_000,
    maxRetries: 1,
  });
}

function extractUrls(response: any) {
  const urls: any[] = [];
  for (const item of response.output || []) {
    if (item.type !== 'message') continue;
    for (const c of item.content || []) {
      for (const a of c.annotations || []) {
        if (a.type === 'url_citation')
          urls.push({ url: a.url, title: a.title });
      }
    }
  }
  return urls;
}

export async function buildEdition() {
  if (process.env.PORTFOLIO_MODE !== 'false') {
    throw new Error(
      'Generation is disabled in PORTFOLIO_MODE so the demo cannot incur API costs.',
    );
  }

  const openai = getClient();

  console.log('Signal AI: starting discovery');

  const discovery = await openai.responses.create({
    model: 'openai/gpt-6-luna',
    reasoning: { effort: 'medium' },
    tools: [
      {
        type: 'openrouter:web_search',
      } as any,
    ],
    input: `${DISCOVERY_PROMPT}
Today is ${new Date().toISOString()}.

Source priors:
${JSON.stringify(SOURCES)}`,
  });

  console.log('Signal AI: discovery complete');

  const cited = extractUrls(discovery);

  console.log('Signal AI: starting critic');

  const judged = await openai.responses.create({
    model: 'openai/gpt-6.1-sol',
    reasoning: { effort: 'low' },
    max_output_tokens: 5000,
    input: `${CRITIC_PROMPT}

Candidates:
${discovery.output_text}

Cited URLs from discovery:
${JSON.stringify(cited)}

Source priors:
${JSON.stringify(SOURCES)}`,
    text: {
      format: {
        type: 'json_schema',
        name: 'newsletter_edition',
        strict: true,
        schema: newsletterSchema as any,
      },
    },
  });

  console.log('Signal AI: critic complete');

  const edition = JSON.parse(judged.output_text);

  if (!edition.items || edition.items.length !== 5) {
    throw new Error(
      `Critic returned ${edition.items?.length ?? 0} stories instead of exactly 5.`,
    );
  }

  const invalidPatterns = [
    /awaiting/i,
    /additional.*story/i,
    /no fifth story/i,
    /not a news story/i,
    /placeholder/i,
    /story was supplied/i,
    /no story/i,
    /requires inventing/i,
  ];

  const invalidItem = edition.items.find((item: any) => {
    const combinedText = [
      item.title,
      item.publisher,
      item.summary,
      item.teachingMoment,
      item.caveat,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      !item.title ||
      !item.publisher ||
      !item.url ||
      !/^https?:\/\//i.test(item.url) ||
      !item.summary ||
      invalidPatterns.some((pattern) => pattern.test(combinedText))
    );
  });

  if (invalidItem) {
    throw new Error(
      `Critic produced an invalid or placeholder story: ${
        invalidItem.title || 'Untitled story'
      }`,
    );
  }

  return edition;
}

export function renderHtml(edition: any) {
  const items = edition.items
    .map(
      (x: any, i: number) =>
        `<section style="margin:0 0 48px">
          <div style="font:600 12px Arial;color:#697386;text-transform:uppercase;letter-spacing:.08em">
            ${i + 1} · ${x.publisher} · ${x.category}
          </div>

          <h2 style="font:700 26px Arial;margin:8px 0">
            <a href="${x.url}" style="color:#111827;text-decoration:none">
              ${x.title}
            </a>
          </h2>

          <div style="font:14px Arial;color:#6b7280;margin-bottom:14px">
            ${x.publishedAt}
          </div>

          ${x.summary
            .split(/\n\s*\n/)
            .map(
              (paragraph: string) =>
                `<p style="font:16px/1.65 Arial;color:#1f2937;margin:0 0 16px">${paragraph.trim()}</p>`,
            )
            .join('')}

          <p style="font:16px/1.65 Arial;color:#1f2937">
            <b>What you can learn:</b> ${x.teachingMoment}
          </p>

          <p style="font:15px/1.6 Arial;color:#4b5563">
            <b>Caveat:</b> ${x.caveat}
          </p>

          <p>
            <a href="${x.url}">Read the original →</a>
          </p>
        </section>`,
    )
    .join('');

  return `<div style="max-width:700px;margin:auto;padding:32px 18px;background:#fff">
    <div style="font:700 13px Arial;letter-spacing:.14em;margin-bottom:32px">
      SIGNAL AI
    </div>

    ${items}

    <hr style="border:0;border-top:1px solid #e5e7eb">

    <p style="font:12px Arial;color:#6b7280">
      You subscribed to Signal AI.
      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>.
    </p>
  </div>`;
}
