'use client';
import { FormEvent, useState } from 'react';

const sample = [
  ['AI agents are getting better at doing research — but decomposition may matter as much as model intelligence', 'OpenAI · AI agents / Science'],
  ['Real-world AI automation still looks much weaker than benchmark headlines suggest', 'Epoch AI · Evaluation / Agents'],
  ['A new benchmark asks whether an AI is fair after you challenge its reasoning', 'Ai2 · Evaluation / Fairness'],
  ['Independent evaluators are getting access closer to what AI companies see internally', 'Reuters / METR · AI safety / Governance'],
  ['AI can search millions of proteins for promising antibiotics — proving them is still a laboratory problem', 'Google DeepMind · AI for science']
];

export default function Home() {
  const [status, setStatus] = useState('');

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    const website = String(form.get('website') || '');
    setStatus('Saving…');
    const r = await fetch('/api/subscribe', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({ email, website })
    });
    const j = await r.json();
    setStatus(r.ok ? j.message : (j.error || 'Something went wrong.'));
  }

  return <>
    <header className="shell topbar">
      <div className="brand">Signal AI</div>
    </header>

    <main>
      <section className="shell hero compact-hero">
        <div>
          <div className="kicker">Twice-weekly AI briefing</div>
          <h1>5 AI reads,<br/>15 minutes total</h1>
          <p className="lede">Understand what changed in AI without scrolling through launches, funding announcements and recycled hype.</p>
        </div>

        <aside className="subscribe-card">
          <h2>Get the next edition</h2>
          <p>Five carefully selected reads, each with the evidence, context, teaching point and caveat that make it worth your time.</p>
          <form className="form" onSubmit={subscribe}>
            <input name="email" type="email" required autoComplete="email" aria-label="Email address" placeholder="you@example.com" />
            <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button>Subscribe</button>
          </form>
          <div className="consent">By subscribing, you agree to receive Signal AI twice a week. Unsubscribe anytime. <a href="/privacy">Privacy</a>.</div>
          <div className="status" aria-live="polite">{status}</div>
        </aside>
      </section>

      <section id="sample" className="shell section example-section">
        <div className="section-head simple-head">
          <h2>Example newsletter</h2>
          <p className="section-intro">Five substantive reads, roughly 2–3 minutes each.</p>
        </div>

        <div className="sample">
          <div className="sample-header">
            <div><span>22 OCTOBER 2026</span><h3>Signal AI</h3></div>
            <span>~15 minute read</span>
          </div>
          <div className="sample-list">
            {sample.map((item,i)=><a className="sample-item" href="/example" key={item[0]}>
              <div className="sample-index">0{i+1}</div>
              <div><h4>{item[0]}</h4><p>{item[1]}</p></div>
              <div className="read">2–3 min →</div>
            </a>)}
          </div>
        </div>
        <div className="cta-row single-cta"><a className="button-link" href="/example">Read the full example</a></div>
      </section>
    </main>

    <footer className="shell"><div>Signal AI</div></footer>
  </>;
}
