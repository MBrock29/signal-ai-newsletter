const stories = [
  {
    meta:'01 · OpenAI · 21 October 2026 · AI agents / Science',
    title:'AI agents are getting better at doing research — but decomposition may matter as much as model intelligence',
    paragraphs:[
      'OpenAI, PerturbAI and Scripps Research used thousands of AI agents to analyse a whole-brain CRISPR atlas containing data from millions of mouse brain cells. Rather than hand one model an enormous dataset and ask it to make sense of everything, the researchers divided the work: individual agents investigated particular gene disruptions, examined cellular responses, searched the scientific literature and proposed mechanisms that could explain what they saw. The reports were then combined into a reasoning atlas that researchers can inspect.',
      'The strongest result is less about biology than about system design. When the workload became large, a single agent searched progressively less of the available literature. At the largest workload it cited only 11 references, while the distributed agents cited more than 700. In blinded comparisons, human experts preferred the distributed-agent interpretations 75% of the time. The system completed the large analysis in 32 minutes; the authors estimate a comparable perturbation-by-perturbation human review could take months to a year.',
      'That gives a concrete reason to care about multi-agent architecture. The advantage does not have to come from agents “debating” each other. It can come from breaking a huge search space into many bounded tasks, letting each worker spend its context and tool budget on a narrow problem, then recombining the outputs. This is closer to distributed computing or map-reduce than to a virtual office full of personalities.',
      'The biological examples are promising but preliminary. The agents surfaced a possible link between DCTN1 disruption, cholesterol regulation and neurodegeneration, and identified differences between Tsc1 and Tsc2 disruptions in cerebellar neurons. Those are useful hypotheses because they point scientists towards experiments worth running; they are not validated disease mechanisms or treatments.',
      'The research also illustrates a practical bottleneck in long-context agent systems. Giving a single agent more material does not guarantee it will inspect that material proportionally well: attention, search budget and tool-use decisions become scarce resources. Distributed workers can each spend those resources locally. The important systems question then shifts to orchestration: how should tasks be partitioned, how are conflicting reports reconciled, and how do you prevent thousands of plausible but low-quality findings from overwhelming the human reviewer?',
      'For software engineers, this is transferable beyond biology. Large code migrations, security audits, due-diligence research and document review all have similar shapes: many semi-independent units can be examined in parallel and then aggregated. The useful pattern is not “add more agents” indiscriminately; it is to find work that decomposes cleanly, define a consistent output schema, preserve provenance and reserve human attention for synthesis and verification.'
    ],
    lesson:'For long-horizon research, orchestration can be as important as raw model capability. If one agent becomes context- or attention-limited, decomposing work into many narrow searches can improve coverage dramatically.',
    caveat:'The evidence comes from a collaboration involving OpenAI and uses OpenAI models. More importantly, generating a plausible hypothesis is much easier than experimentally proving that hypothesis is biologically correct.',
    url:'https://openai.com/index/scaling-ai-research-for-complex-biological-data/'
  },
  {
    meta:'02 · Epoch AI · 8 October 2026 · Evaluation / Agents',
    title:'Real-world AI automation still looks much weaker than benchmark headlines suggest',
    paragraphs:[
      'Epoch AI built a benchmark from work its own employees actually perform: research design, AI data-centre research, data insight generation, data-explorer creation and graphic design. Instead of asking whether a model can solve a tidy coding problem with a known answer, the benchmark asks models to produce artefacts that human graders compare against Epoch’s internal quality standards.',
      'The leading systems in the published results average about 65% of the quality Epoch expects from its own employees. Claude Fable 5.1 in Claude Code and GPT-6 Astra Codex both land around that level overall, but their strengths differ by task. Performance is much lower in some open-ended categories: for example, research design remains significantly harder than certain data-analysis or design tasks. The point is not that 65% is poor — it is that a frontier model that looks extraordinary on conventional benchmarks can still fall well short when success depends on judgement, ambiguity and knowing what a good deliverable should contain.',
      'This highlights a persistent automation gap. Tasks with crisp specifications and cheap verification are easier to automate because the model receives a clear target and mistakes are visible. Real knowledge work often includes choosing the target, deciding which evidence is sufficient, resolving contradictory information and understanding unstated organisational preferences. Those are not side details; they are part of the job.',
      'For companies, this suggests a more useful way to think about adoption than asking “can AI do this role?”. Break a role into task types, distinguish well-specified work from judgement-heavy work, then measure output quality under realistic conditions. That may reveal large pockets of automation without supporting the stronger claim that the entire occupation is ready to disappear.',
      'The category-level results are useful because they show that “agent performance” is not one number. GPT-6 Astra Codex, for example, scores strongly on some design and research tasks but much worse on data-explorer generation, while other systems show different profiles. A team choosing an agent therefore needs task-specific evaluations, not a single general leaderboard position. The model that wins an abstract capability index may not be the best fit for a messy internal workflow.',
      'There is also a measurement lesson here. Human graders compare outputs with an internal standard rather than checking an exact answer key. That makes the benchmark noisier, but also closer to real professional evaluation: a report can be factually correct yet still be badly prioritised, poorly scoped or not useful enough to ship. As agents move into knowledge work, these rubric-based evaluations are likely to matter more than pass/fail coding tests alone.'
    ],
    lesson:'Benchmark scores are only as meaningful as the task distribution they represent. Realistic, open-ended evaluations can reveal capability gaps that disappear on clean benchmark problems.',
    caveat:'These tasks come from Epoch, a specialised AI research organisation. Other workplaces may contain much more repetitive or well-specified work and therefore be easier to automate.',
    url:'https://epoch.ai/benchmarks/epoch-automation-reports'
  },
  {
    meta:'03 · Ai2 · 20 October 2026 · Evaluation / Fairness',
    title:'A new benchmark asks whether an AI is fair after you challenge its reasoning',
    paragraphs:[
      'Ai2’s FairStress benchmark tries to measure something ordinary fairness tests can miss. A standard demographic fairness test might create two otherwise identical hiring, lending, healthcare or admissions scenarios, swap the demographic identity involved and ask whether the model reaches the same decision. That is useful, but it mainly tests the final choice.',
      'FairStress adds pressure. It examines whether a model applies the same standards when its decision is challenged and whether it is equally resistant to changing a well-supported answer regardless of which demographic group benefits. Ai2 reports differences not only in model explanations but also in internal activation patterns across domains including hiring, lending, healthcare, education and housing, even when headline outcome metrics can appear fair.',
      'The broader lesson reaches beyond fairness. As models become optimised against popular benchmarks, evaluators increasingly need to test trajectories rather than snapshots. A system may produce the right first answer but become inconsistent after follow-up prompts, abandon a constraint later in a workflow, or justify similar outcomes using materially different standards. Agentic systems make this more important because consequential behaviour unfolds over many steps.',
      'FairStress defines fairness in a particular symmetric way: when evidence supports a decision, equivalent demographic cases should receive equivalent treatment and equivalent robustness to adversarial pressure. That is coherent, but it is not the only philosophical definition of fairness. An equity-based framework may deliberately account for historical disadvantage, for example.',
      'The benchmark is also interesting because it joins a wider move away from “did the model answer correctly once?” testing. Safety researchers increasingly care about robustness under adversarial prefixes, repeated questioning and longer interaction histories. In an agent, the first action may be harmless while the tenth action exposes the failure. A fair first answer is similarly less reassuring if a small amount of pressure causes the system to apply a different standard to different people.',
      'For product teams deploying LLMs in consequential workflows, the practical takeaway is to test policies as conversations and trajectories. Build paired cases, perturb demographic attributes, challenge the model’s initial decision, inspect whether its rationale remains stable and test whether safeguards survive alternative phrasings. A single aggregate “fairness score” can be useful monitoring data, but it should not replace behavioural probes designed around the actual way users interact with the system.'
    ],
    lesson:'Evaluating the final output is often insufficient. For systems that interact over time, robust evaluation should probe whether behaviour stays consistent under pressure, reformulation and follow-up.',
    caveat:'A difference in explanation or internal activation does not automatically establish harmful discrimination. The benchmark exposes behaviour worth investigating; interpretation still matters.',
    url:'https://allenai.org/blog/fairstress'
  },
  {
    meta:'04 · Reuters / METR · 15 October 2026 · AI safety / Governance',
    title:'Independent evaluators are getting access closer to what AI companies see internally',
    paragraphs:[
      'Anthropic has given the independent nonprofit METR unusually deep access to its systems for safety evaluation. Reuters reports that METR researchers can work with access comparable in some respects to Anthropic’s own risk-assessment teams, including company hardware and office space. They are still excluded from areas such as customer data, privileged legal information and model architecture.',
      'The governance detail that matters is publication control. Anthropic cannot simply veto METR’s conclusions. The company can request certain redactions, particularly around sensitive security information, but METR can publicly contest those redactions. That creates a stronger arrangement than the common pattern where a lab commissions outside testing while retaining substantial control over what outsiders can see or say.',
      'Why does access matter? Frontier labs possess far more information about their models than researchers who can only probe a public API. An evaluator with pre-release access can test capabilities before deployment; an evaluator with internal tooling, staff interviews and relevant monitoring data can ask whether the developer’s own controls are working. METR separately published a proposal describing five questions for control assessment, including monitor coverage, monitor vulnerabilities, evasion, human response and whether safeguards remain reliable under pressure.',
      'This creates a useful ladder of assurance: public black-box testing, pre-release model access, access to internal evaluation infrastructure, and finally evaluation of the organisation’s actual control systems. Calling all four “independent evaluation” hides meaningful differences.',
      'METR’s own control-assessment proposal makes the problem concrete. It asks whether all relevant internal agent activity is actually monitored; whether an agent could interfere with the monitoring infrastructure; whether harmful behaviour can evade the monitor; whether human reviewers respond quickly enough to flags; and whether the overall system would still work against an agent actively trying to avoid oversight. These are operational-security questions, not just model-behaviour questions.',
      'That matters as labs begin using increasingly capable agents inside their own research and engineering environments. A model with access to code, credentials, experiment infrastructure or model weights creates a different risk surface from a chatbot answering public questions. Evaluating such systems requires understanding permissions, logging, escalation paths and human review. In other words, frontier-model safety starts to look partly like conventional security engineering — but with a potentially strategic software actor inside the system.'
    ],
    lesson:'Independence is partly an access problem. External evaluators cannot verify strong safety claims if they are allowed to inspect only the public surface of a system while the important evidence remains internal.',
    caveat:'Deep access does not guarantee independence. Funding, confidentiality obligations, publication constraints and the voluntary nature of the arrangement still matter. It is also not a substitute for regulation where regulation is appropriate.',
    url:'https://www.reuters.com/business/anthropic-grants-ai-evaluator-metr-employee-level-access-its-models-2026-10-15/'
  },
  {
    meta:'05 · Google DeepMind · 15 October 2026 · AI for science / Biology',
    title:'AI can search millions of proteins for promising antibiotics — proving them is still a laboratory problem',
    paragraphs:[
      'Google DeepMind demonstrated an agentic workflow for antimicrobial discovery using Google Antigravity, its agentic science workbench. The system can combine searches across scientific databases, literature and specialised biological tools rather than forcing a researcher to manually shuttle information between them. In the published walkthrough, the workflow searched millions of previously poorly characterised proteins in UniProt using ProtNLM, a model that predicts biological function from amino-acid sequences.',
      'The agents narrowed that huge search space, checked genomic context and existing literature, evaluated structural information and proposed candidates worth laboratory testing. One highlighted result is a 97-amino-acid protein that the system identified as a plausible antimicrobial peptide candidate with predicted activity relevant to pathogens involved in respiratory tract infections.',
      'This is a good example of where AI-for-science claims should be interpreted carefully. The impressive part is not “AI discovered a new antibiotic”. The impressive part is search compression: a workflow that can move from millions of candidate proteins to a much smaller set of biologically plausible experiments. Wet-lab scientists still determine whether a candidate actually has antimicrobial activity, whether it is toxic, whether it can be delivered safely and whether the result survives replication.',
      'If workflows like this generalise, the economic impact can still be large even without autonomous discovery. Scientific organisations spend enormous amounts of expert time deciding which hypotheses are worth expensive experiments. Improving that prioritisation step can increase the number and quality of experiments humans are able to run.',
      'The key distinction is between computational search and physical verification. Software agents can cheaply read papers, query databases, compare sequences and generate ranked hypotheses at enormous scale. Wet-lab work has very different economics: experiments take time, materials, specialist equipment and often multiple rounds of replication. That makes candidate prioritisation unusually valuable because every weak candidate eliminated before the laboratory can save real money and scarce experimental capacity.',
      'It also suggests how to judge future “AI discovered X” headlines. Ask which part of the scientific pipeline the AI actually performed. Did it identify a correlation, generate a hypothesis, predict a structure, design a candidate molecule, run a simulation, or produce experimentally validated evidence? Those are materially different achievements. A system that reliably improves the first four steps could be economically important even if humans remain essential for the final validation steps.'
    ],
    lesson:'AI can create value in science by reducing the search space before expensive physical experiments. “Better hypothesis prioritisation” is a more credible near-term claim than “AI replaces the scientist”.',
    caveat:'The highlighted peptide remains a predicted candidate undergoing validation. DeepMind is describing its own platform, so the workflow should be separated from any stronger claim that the candidate will become a usable drug.',
    url:'https://deepmind.google/blog/accelerating-antimicrobial-discovery/'
  }
];

export default function ExampleEdition() {
  return <>
    <header className="article-shell article-nav"><a href="/" style={{textDecoration:'none'}} className="brand">Signal AI</a><a href="/" style={{color:'#aaa89f'}}>← Back</a></header>
    <main className="article-shell edition">
      <div className="edition-label">22 October 2026 · ~15 minutes</div>
      <h1>Five things worth understanding this week.</h1>
      <p className="edition-dek">This is the longer target format: approximately 2–3 minutes per article, with enough detail to understand the mechanism, evidence and limitation rather than just the headline.</p>
      {stories.map((s,i)=><article className="story" key={s.title}>
        <div className="story-meta">{s.meta}</div>
        <h2>{s.title}</h2>
        {s.paragraphs.map(p=><p key={p.slice(0,40)}>{p}</p>)}
        <div className="callout"><strong>What you can learn</strong><p>{s.lesson}</p></div>
        <div className="callout"><strong>Caveat</strong><p>{s.caveat}</p></div>
        <a className="source-link" href={s.url} target="_blank" rel="noreferrer">Read the original source →</a>
      </article>)}
      <section className="rejected">
        <h3>What the editor rejected</h3>
        <ul>
          <li><b>Claude Duet launch:</b> commercially relevant, but primarily a product announcement without enough independent evidence yet to justify one of five slots.</li>
          <li><b>Gemini 4 Argon launch coverage:</b> major frontier-model news, but launch coverage alone offers less teaching value than the selected research/evaluation pieces.</li>
          <li><b>OpenAI acquisition of Orchestra Bio:</b> strategically interesting company news, but weaker as an educational read than the underlying scientific-agent work.</li>
        </ul>
      </section>
    </main>
  </>;
}
