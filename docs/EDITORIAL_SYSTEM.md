# Editorial system design

Signal AI is intentionally built as a multi-stage editorial workflow rather than a single prompt that asks a model for “the five best AI stories”.

## Why separate discovery and judgement?
Discovery rewards recall: find a broad enough pool that important work is not missed.
Selection rewards precision: reject weak evidence, duplication and attention-grabbing material that does not teach the reader much.

Combining both in one pass creates selection bias: the model has a tendency to rationalise stories it already chose. A separate critic receives the candidate set plus a fixed rubric and can reject the discoverer's choices.

## Quality model
A strong story should answer most of these questions:
- What actually happened?
- What evidence supports it?
- Is the evidence primary, independent, or company-supplied?
- What mechanism explains the result?
- Is there a useful number, experiment or benchmark?
- What should the reader understand afterwards that transfers beyond this article?
- What is the strongest caveat?

## Diversity as a guardrail
Source diversity is not cosmetic. Without constraints, a week dominated by launches can produce five versions of the same story. Portfolio rules therefore cap primary-lab representation and same-company representation.

## Cost-safe portfolio mode
The repository defaults to `PORTFOLIO_MODE=true`.
- The website renders locally with no API keys.
- The email form demonstrates the subscriber experience but does not call a paid email service.
- The sample edition is static and auditable.
- Optional OpenAI/Resend code can be enabled later when the project is intentionally moved from portfolio prototype to live service.

This keeps the portfolio demo free to run while preserving the system design for a production version.
