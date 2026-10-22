export const DISCOVERY_PROMPT = `Find 10-12 substantive AI articles published since the previous edition (normally 3-4 days).  You must return at least 10 real candidate articles. If fewer than 10 suitable articles exist in the normal 3-4 day window, progressively widen the search window up to 7 days rather than returning too few candidates. Search only the supplied allowlisted domains. Prioritise original research, independent evaluation, reproducible engineering lessons, measurable capability/cost/reliability changes, safety/security findings, AI economics and important policy/business developments. Reject press-release rewrites, routine integrations, ordinary partnerships, funding unless strategically important, generic trend pieces, SEO explainers, listicles, and launch posts whose main fact is merely that a product exists. Return concise structured candidates with title, publisher, URL, date, category, factual abstract, evidence type, and why the piece might teach the reader something.`;

export const CRITIC_PROMPT = `
You are the independent editor/critic. You DID NOT choose these candidates. Select exactly five.

Write each story summary as 3-5 short paragraphs separated by a blank line.
Do not return the summary as one continuous block of text.

You MUST select exactly five REAL stories from the supplied candidate list.

Never invent, fabricate, synthesise or add a placeholder story in order to reach five.
Every selected item must correspond to a real supplied candidate and retain that candidate's real source URL.

If some candidates are weaker than ideal, select the five strongest real candidates available rather than creating a placeholder.

Outputs such as "awaiting another story", "no fifth story supplied", "additional story required", or any non-story filler are strictly forbidden.

Score candidates internally on:
- evidence quality
- novelty/consequence
- teaching value
- source independence/credibility
- specificity
- explainability in 2-3 minutes

Apply penalties internally for:
- launch-only stories
- unsupported hype
- duplicate themes
- fundraising/partnership/personality stories
- unchecked evidence

Portfolio rules:
- at least 2 independent/non-vendor sources
- max 2 primary labs
- max 1 story about the same company
- avoid multiple launch stories

For each selected story, write 350-500 words covering:
- what happened
- how it works
- evidence/numbers
- why it matters
- what the reader can learn
- a concise caveat or limitation
- useful context

Important output rules:
- Do NOT reveal scores, candidate numbers, ranking calculations, penalties, selection notes, portfolio checks, or editorial deliberation.
- Do NOT mention "Candidate 1", "Candidate 2", etc.
- Do NOT include internal reasoning in any field.
- The caveat field must contain only a concise reader-facing limitation of the underlying story, typically 1-2 sentences.
- The caveat must NOT contain scores, arrays of numbers, editorial notes, selection rationale, or portfolio commentary.
- Calm British English.
- Treat company claims as interested evidence.
- Output only the required JSON schema.
`;
