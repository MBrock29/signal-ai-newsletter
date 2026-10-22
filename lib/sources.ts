export type Source = { rank:number; name:string; domain:string; tier:'A'|'B'|'C'; type:string; strength:string; risk:string };
export const SOURCES: Source[] = [
{rank:1,name:'METR',domain:'metr.org',tier:'A',type:'Independent evaluation',strength:'Rigorous frontier-model evaluations and methodology',risk:'Narrow focus; not a general news source'},
{rank:2,name:'Epoch AI',domain:'epoch.ai',tier:'A',type:'Independent research',strength:'Data-driven work on capabilities, compute, economics and trends',risk:'Some pieces are long and highly specialised'},
{rank:3,name:'AI2',domain:'allenai.org',tier:'A',type:'Nonprofit research lab',strength:'Open research, benchmarks, models and reproducible technical work',risk:'Naturally highlights its own projects'},
{rank:4,name:'Simon Willison',domain:'simonwillison.net',tier:'A',type:'Independent practitioner',strength:'Fast, technically literate hands-on analysis with unusually low hype',risk:'One author; strong developer/tooling skew'},
{rank:5,name:'Interconnects',domain:'interconnects.ai',tier:'A',type:'Independent researcher newsletter',strength:'Frontier/open-model analysis from a working researcher',risk:'Opinionated and sometimes speculative'},
{rank:6,name:'Import AI',domain:'jack-clark.net',tier:'A',type:'Research newsletter',strength:'Excellent research curation and explanations',risk:'Author is Anthropic co-founder; perspective is not institutionally neutral'},
{rank:7,name:'Google DeepMind',domain:'deepmind.google',tier:'A',type:'Primary lab',strength:'Primary source for major research, science and safety work',risk:'Company framing; model/product launches need filtering'},
{rank:8,name:'OpenAI Research',domain:'openai.com',tier:'A',type:'Primary lab',strength:'Primary evidence for OpenAI research and safety work',risk:'Mixes research with launches and company messaging'},
{rank:9,name:'Anthropic',domain:'anthropic.com',tier:'A',type:'Primary lab',strength:'Strong safety, interpretability and science publications',risk:'Newsroom contains partnerships and announcements'},
{rank:10,name:'Microsoft Research',domain:'microsoft.com',tier:'A',type:'Industrial research',strength:'Broad, deep research with strong technical detail',risk:'Huge volume; needs aggressive topical filtering'},
{rank:11,name:'Mistral AI Research',domain:'mistral.ai',tier:'B',type:'Primary lab',strength:'Useful European/open-weight model and engineering research',risk:'Product/company posts are mixed into feed'},
{rank:12,name:'Cohere Research',domain:'cohere.com',tier:'B',type:'Primary lab',strength:'Good retrieval, agents and enterprise-ML technical material',risk:'Substantial enterprise/product marketing content'},
{rank:13,name:'Hugging Face',domain:'huggingface.co',tier:'B',type:'Open-source ecosystem',strength:'Early access to strong open research and practitioner work',risk:'Community quality varies widely; author identity matters'},
{rank:14,name:'Artificial Analysis',domain:'artificialanalysis.ai',tier:'B',type:'Independent benchmarking',strength:'Useful price/speed/capability comparisons across models',risk:'Benchmarks can over-compress real-world capability'},
{rank:15,name:'Meta AI',domain:'ai.meta.com',tier:'B',type:'Primary lab',strength:'Primary research on multimodal, open and science work',risk:'Company/product framing and irregular cadence'},
{rank:16,name:'xAI',domain:'x.ai',tier:'B',type:'Primary lab',strength:'Primary source for Grok research/safety claims',risk:'High proportion of launches and promotional claims'},
{rank:17,name:'SemiAnalysis',domain:'semianalysis.com',tier:'B',type:'Independent industry analysis',strength:'Deep AI infrastructure, chips and economics analysis',risk:'Many pieces are paywalled; strong thesis-driven voice'},
{rank:18,name:'Latent Space',domain:'latent.space',tier:'B',type:'Practitioner media',strength:'Detailed interviews and technical ecosystem coverage',risk:'Long-form and occasionally vendor-adjacent'},
{rank:19,name:'The Gradient',domain:'thegradient.pub',tier:'B',type:'Independent publication',strength:'Thoughtful research commentary with academic flavour',risk:'Lower publishing frequency'},
{rank:20,name:'Reuters AI',domain:'reuters.com',tier:'B',type:'Newswire',strength:'High-quality factual business, policy and geopolitical reporting',risk:'Less technical depth and teaching value'},
{rank:21,name:'Financial Times AI',domain:'ft.com',tier:'B',type:'Newsroom',strength:'Strong business, capital, policy and strategy reporting',risk:'Paywall; not primarily technical'},
{rank:22,name:'MIT Technology Review',domain:'technologyreview.com',tier:'B',type:'Technology newsroom',strength:'Strong explanatory journalism and research context',risk:'Paywall and occasional broad trend pieces'},
{rank:23,name:'WIRED AI',domain:'wired.com',tier:'C',type:'Technology newsroom',strength:'Good investigations and social/policy context',risk:'Variable technical depth; headline-driven pieces need filtering'},
{rank:24,name:'TechCrunch AI',domain:'techcrunch.com',tier:'C',type:'Technology newsroom',strength:'Fast startup/funding/product coverage',risk:'High volume and launch-news bias; use only for genuinely consequential stories'},
{rank:25,name:'arXiv',domain:'arxiv.org',tier:'C',type:'Preprint repository',strength:'Earliest primary research',risk:'Unreviewed and enormous volume; only include with corroboration or unusually strong evidence'}
];
export const ALLOWED_DOMAINS = SOURCES.map(s => s.domain);
