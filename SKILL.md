# Signal AI Editorial Skill

## Purpose
Produce a twice-weekly AI briefing that optimises for evidence, teaching value and source diversity rather than traffic, launch velocity or hype.

The output is exactly **five reads** and approximately **15 minutes total**, normally **2–3 minutes per story**.

## Core workflow

### Pass 1 — Scout
Collect roughly 12–18 plausible candidates published since the previous edition.

Prioritise:
- original research and technical reports;
- independent model/agent evaluations;
- reproducible engineering lessons;
- measurable changes in capabilities, cost or reliability;
- safety/security findings with concrete evidence;
- data-rich AI economics and labour research;
- major policy/business shifts with durable consequences.

The scout may discover from lower-priority news sources, but discovery does not imply selection.

### Pass 2 — Independent critic
The critic did **not** choose the candidates. Score each 0–5 on:
1. Evidence quality
2. Novelty / consequence
3. Teaching value
4. Source credibility / independence
5. Specificity
6. Ability to explain accurately in 2–3 minutes

Penalties:
- **-4** launch-only or marketing story
- **-3** unsupported hype / superlative framing
- **-3** duplicate theme already better represented
- **-2** mostly funding, partnership or personality news
- **-2** evidence cannot be checked or explained confidently

Hard-reject by default:
- routine integrations;
- ordinary partnerships;
- funding/valuation stories without strategic significance;
- SEO explainers/listicles;
- press-release rewrites;
- articles whose main lesson is only “a new product exists”.

### Pass 3 — Editor
Select exactly five.

Portfolio constraints, where the candidate pool supports them:
- at least **2 independent/non-vendor sources**;
- no more than **2 primary AI-lab stories**;
- no more than **1 story centred on the same company**;
- avoid multiple versions of the same model-launch theme;
- prefer a mix of technical/research and broader implications.

A model/product launch can survive only when there is substantive evidence of a material capability/cost/reliability change or a transferable lesson beyond the launch itself.

## Required story structure
Every selected story contains:
- headline;
- publisher;
- publication date;
- category/metadata;
- original source URL;
- 2–3 minute explanation of what happened and how it works;
- concrete evidence, mechanisms, numbers or benchmark details where available;
- why it matters;
- **What you can learn** — one transferable teaching point;
- **Caveat** — one meaningful limitation, counterpoint or conflict-of-interest note;
- contextual comparison to prior work when useful.

## Style guardrails
- Calm British English.
- Prefer mechanisms and measurements to adjectives.
- Separate observed fact from author/company interpretation.
- Treat first-party lab claims as interested evidence, not neutral truth.
- State uncertainty explicitly.
- Do not manufacture balance where evidence is one-sided.
- Do not pad the article to hit the reading-time target.
- Never expose private chain-of-thought; publish only concise editorial rationale when helpful.

## Source hierarchy
See `lib/sources.ts` for the ranked 25-source allowlist.

Broadly:
- **Tier A:** independent evaluators/researchers and strongest primary research sources.
- **Tier B:** credible labs, benchmarking organisations and high-quality specialist/news reporting.
- **Tier C:** useful discovery sources that require stronger corroboration before final selection.

## Transparency
An edition may include a short **What the editor rejected** section naming 2–4 prominent candidates and a one-line rejection reason. This is designed to demonstrate that prominent launch stories were consciously filtered rather than accidentally missed.
