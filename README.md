# Signal AI

**Five AI reads. No slop.**

Signal AI is a portfolio prototype for a twice-weekly AI newsletter that deliberately optimises for **evidence, teaching value and source diversity** instead of launch velocity and hype.

The personal production version runs as a ChatGPT Scheduled Task at no incremental API cost. This repository demonstrates the product UI and the underlying editorial/agent architecture without requiring paid infrastructure.

## What it demonstrates

- A ranked **25-source allowlist** spanning independent evaluators, research labs and selected journalism.
- A **Scout → Critic → Editor** workflow that separates discovery from judgement.
- Explicit scoring and rejection criteria for AI-news quality.
- Guardrails against launch spam, duplicate themes and single-company domination.
- A public newsletter landing page with an email capture experience.
- A complete ~15-minute sample edition.
- A safe **portfolio mode** that makes no paid API or email calls.

## Editorial architecture

### 1. Scout
Find ~12–18 candidates from the allowlisted domains.

### 2. Critic
Independently score candidates on evidence quality, consequence, teaching value, credibility/independence, specificity and explainability.

### 3. Editor
Select exactly five while enforcing source/company diversity.

Read the full human-readable editorial contract in [`SKILL.md`](./SKILL.md) and the design rationale in [`docs/EDITORIAL_SYSTEM.md`](./docs/EDITORIAL_SYSTEM.md).

## Reading target

Each edition contains exactly five stories and targets **~15 minutes total reading time**, normally **350–500 words / 2–3 minutes per article**.

Every article includes:
- what happened and how it works;
- concrete evidence/numbers where available;
- why it matters;
- **What you can learn**;
- a meaningful **Caveat**;
- the original source.

## Run locally — £0 mode

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

`PORTFOLIO_MODE=true` is the default. In this mode:
- no OpenAI API calls are made;
- no Resend/email calls are made;
- email entry demonstrates the UI safely;
- the full sample edition is available at `/example`.

## Optional future production path

The repository still contains the core code for a two-model discovery/critic workflow (`lib/newsletter.ts`, `lib/prompts.ts`) that can later be wired to OpenAI API web search and an email provider.

That production path is intentionally **not enabled by default** because the current goal is a no-incremental-cost portfolio project. The user's real twice-weekly briefing is handled by a ChatGPT Scheduled Task instead.

## Repository map

```text
app/
  page.tsx                 Landing page + email capture UI
  example/page.tsx         Full sample newsletter
  api/subscribe/route.ts   Cost-safe portfolio subscription endpoint
lib/
  sources.ts               Ranked source allowlist + source risks
  prompts.ts               Scout and critic instructions
  schema.ts                Structured newsletter schema
  newsletter.ts            Optional production agent workflow
SKILL.md                    Public editorial guardrails / agent contract
docs/EDITORIAL_SYSTEM.md    Architecture and design rationale
```

## Editorial principles

Reject by default:
- launch-only posts;
- ordinary integrations/partnerships;
- funding/valuation news without strategic importance;
- unsupported hype;
- recycled press releases;
- SEO/listicle content;
- stories whose only lesson is that a product launched.

Prefer:
- original research;
- independent evaluation;
- reproducible engineering lessons;
- measurable capability/cost/reliability changes;
- concrete safety/security findings;
- data-rich economics;
- consequential policy/business developments.

## Portfolio talking points

This project is designed to demonstrate more than prompt writing. The interesting engineering/product decisions are:
- separating high-recall discovery from high-precision editorial judgement;
- encoding qualitative editorial preferences as auditable constraints;
- balancing first-party primary evidence with independent sources;
- keeping AI inference cost independent of subscriber count by generating one edition and broadcasting it;
- building a zero-cost demo mode so the portfolio project cannot accidentally incur API charges.

## Status

Portfolio prototype. Email delivery and paid model execution are intentionally disabled by default.

## Production v1

The recommended first live version captures real subscribers with Resend while keeping AI generation inside the existing ChatGPT scheduled task. This means the site can be genuinely useful without enabling paid OpenAI API calls. See [`docs/PRODUCTION.md`](docs/PRODUCTION.md) for the deployment checklist.
