# Signal AI

**Live:** [signal-ai-newsletter-89gd.vercel.app](https://signal-ai-newsletter-89gd.vercel.app/)

**Five worthwhile AI reads. About 15 minutes.**

Signal AI is a twice-weekly AI newsletter designed for people who want to understand what is actually changing in AI without following the daily stream of launches, announcements and recycled commentary.

Each edition selects exactly five stories and turns them into concise, evidence-led explanations covering what happened, why it matters, what can be learned from it and where the evidence is still weak.

The goal is simple: **high signal, low noise, and enough technical depth to teach you something.**

## The product

AI news has a filtering problem rather than an information problem.

There is an enormous amount of coverage, but much of it consists of:

- product launches with little evidence of impact;
- company announcements repeated across multiple publications;
- speculative claims about capabilities;
- funding and partnership news with limited practical significance;
- shallow summaries of research;
- multiple stories about effectively the same development.

Signal AI takes the opposite approach.

Instead of trying to cover everything, it deliberately rejects most candidate stories and publishes only five.

Each edition targets approximately **15 minutes of total reading time**, with each story explaining:

- what happened;
- how it works;
- the evidence or numbers behind it;
- why it matters;
- **what you can learn** from it;
- an important **caveat or limitation**;
- a link to the original source.

## Editorial philosophy

Signal AI prioritises information that improves the reader's understanding of AI rather than simply keeping them aware of product announcements.

### Prefer

- original research;
- independent model and system evaluations;
- reproducible engineering lessons;
- measurable changes in capability, cost or reliability;
- safety and security findings;
- data-rich analysis of AI economics;
- consequential policy or business developments;
- work that changes how practitioners should think about building with AI.

### Reject by default

- launch-only announcements;
- routine integrations and partnerships;
- fundraising news without wider strategic importance;
- unsupported capability claims;
- press-release rewrites;
- SEO explainers and listicles;
- duplicated themes;
- stories whose main lesson is simply that a new product exists.

Primary research from AI companies is useful, but company claims are treated as interested evidence rather than neutral conclusions.

## How it works

Signal AI uses a multi-stage AI editorial pipeline rather than asking a single model to "write an AI newsletter".

### 1. Discovery

A scout model searches a curated source pool and identifies roughly 10–12 potentially worthwhile developments.

The source set deliberately mixes:

- independent evaluators and researchers;
- AI research labs;
- technical writers;
- specialist analysis;
- high-quality technology and financial journalism.

The discovery stage optimises for **recall**: finding potentially important material without deciding what deserves publication.

### 2. Independent editorial judgement

A second model receives the candidate set and acts as an independent critic and editor.

Candidates are assessed across factors including:

- evidence quality;
- novelty and consequence;
- teaching value;
- source credibility and independence;
- specificity;
- whether the story can be explained meaningfully in a few minutes.

The editor also applies portfolio-level constraints so an edition does not become five versions of the same story.

For example:

- at least two stories should come from independent/non-vendor sources;
- no single company should dominate an edition;
- primary research labs are intentionally limited;
- duplicate themes are penalised;
- launch stories require substantive evidence to survive selection.

Exactly five stories are selected.

### 3. Structured generation

The selected edition is generated against a strict structured schema rather than relying on free-form model output.

Each story contains fields for:

- title;
- publisher;
- publication date;
- category;
- explanation;
- teaching point;
- caveat;
- original URL.

Structured output makes the generation layer easier to validate, render and evolve independently of the presentation layer.

### 4. Email rendering and review

The structured edition is converted into newsletter HTML and a draft broadcast is created through Resend.

The current workflow intentionally keeps a **human in the loop**: generation and email preparation are automated, while the final edition can be reviewed before sending.

This allows editorial quality to be inspected while the product and selection system are still being refined.

## Technical architecture

Signal AI is built with:

- **Next.js / TypeScript** — application and API routes;
- **OpenRouter** — model routing and AI inference;
- **web-enabled model discovery** — current-source research;
- **structured model output** — predictable newsletter data;
- **Resend** — subscribers, topics and broadcast delivery;
- **Vercel** — hosting, serverless execution and scheduled jobs;
- **Vercel Cron** — twice-weekly automated edition generation.

The production flow is approximately:

```text
Vercel Cron
     │
     ▼
Discovery model + web search
     │
     ▼
12–18 candidate stories
     │
     ▼
Independent critic/editor
     │
     ▼
Exactly 5 selected stories
     │
     ▼
Structured newsletter JSON
     │
     ▼
HTML renderer
     │
     ▼
Resend broadcast draft
     │
     ▼
Human review → Send
```

## Why use multiple model stages?

One of the main design decisions was separating **finding information** from **judging information**.

A single model asked to research and write an edition has an incentive to justify the stories it has already found.

Signal AI instead separates the two responsibilities:

**Discovery optimises for breadth.  
Editorial judgement optimises for selectivity.**

This makes it easier to encode different instructions, model choices and reasoning budgets for each stage.

It also creates a natural place to introduce additional evaluation or verification steps later.

## Engineering considerations

### Reasoning and latency budgets

The two AI stages have different performance requirements.

Discovery benefits from broader search and moderate reasoning because missing an important story is costly. The editorial stage receives a much smaller candidate set and uses a tighter reasoning budget because its task is more constrained.

This keeps the pipeline responsive enough for scheduled serverless execution while reserving model effort for the parts of the workflow where it adds the most value.

The candidate set is also deliberately capped rather than allowing discovery to grow indefinitely. This reduces downstream context size, latency and inference cost while still leaving the editor enough alternatives to reject weak stories.

### Source quality as code

Editorial preferences are encoded explicitly through source priors, prompts, schema constraints and selection rules rather than existing only as informal instructions.

This makes the editorial system more inspectable and easier to iterate on.

### Guarding against AI slop

The system contains explicit negative criteria because generative models will otherwise tend to select stories that are easy to summarise rather than stories that are genuinely useful.

Launch announcements, unsupported claims and duplicated themes therefore carry explicit penalties.

### Structured outputs

The editorial model returns a defined JSON schema.

This separates:

```text
AI reasoning → content data → presentation
```

instead of allowing the model to generate arbitrary newsletter HTML.

That makes rendering deterministic and allows the front end, email design and editorial model to change independently.

### Subscriber-scale economics

AI generation happens **once per edition**, not once per subscriber.

Whether an edition is sent to ten people or ten thousand, the expensive research and editorial stages run once and the resulting broadcast is distributed through the email provider.

### Failure visibility

The automated pipeline includes stage-level logging around discovery, criticism, rendering and email creation so failures can be isolated quickly rather than appearing as an opaque cron timeout.

### Human-in-the-loop publishing

Full automation is technically straightforward, but automatic sending has deliberately not been enabled yet.

For an editorial product, generation quality matters more than eliminating the final review click. The current system therefore automates research, selection, writing and draft creation while retaining human approval before publication.

## Repository structure

```text
app/
  page.tsx
      Public landing page and subscription experience

  example/page.tsx
      Example newsletter edition

  api/
    subscribe/route.ts
      Subscriber capture

    cron/newsletter/route.ts
      Scheduled production pipeline and Resend broadcast creation

lib/
  sources.ts
      Curated source pool and source metadata

  prompts.ts
      Discovery and editorial instructions

  schema.ts
      Structured newsletter output contract

  newsletter.ts
      Model orchestration and newsletter HTML generation

docs/
  EDITORIAL_SYSTEM.md
      Deeper explanation of the editorial architecture

SKILL.md
      Human-readable editorial rules and constraints

vercel.json
      Scheduled production job configuration
```

## Running locally

Install dependencies:

```bash
npm install
```

Create the required environment variables and start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Production generation uses environment variables for OpenRouter, Resend and cron authentication. Secrets are kept outside the repository and supplied through the deployment environment.

## Product direction

The current version proves the core loop:

**discover → judge → explain → review → distribute**

Potential next steps include:

- storing previous editions and preventing repeated coverage automatically;
- tracking which sources and topics consistently survive editorial review;
- measuring subscriber engagement by story/category;
- adding stronger fact-verification between selection and publication;
- using editorial feedback to improve future ranking;
- publishing a browsable archive alongside email editions;
- eventually moving from human-approved drafts to automatic sending once quality is sufficiently predictable.

## What this project demonstrates

Signal AI is both a functioning product and an exploration of how AI systems can be designed around **judgement rather than generation alone**.

The more interesting engineering work is not producing prose. It is designing the surrounding system:

- separating agents by responsibility;
- choosing where higher-cost reasoning is valuable;
- combining live web research with structured generation;
- encoding qualitative editorial judgement as constraints;
- designing anti-hype and source-diversity guardrails;
- creating observable automated workflows;
- integrating AI generation with a real subscriber and email-delivery system;
- deciding where human review remains valuable.

The project reflects a broader approach to building AI products: the model is one component of the system rather than the product itself.
