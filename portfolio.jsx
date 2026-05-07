/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;
const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSelect } = window;

/* ----------------------------- DATA ----------------------------- */

const CASES = [
  {
    id: "auto-qa",
    tag: "01 · Auto-QA",
    meta: "Kapture CX · 2025 → present · 0→1 owner",
    title: "From 2% to 100% — bringing every customer conversation into the light.",
    pitch: "B2B enterprises were auditing only 2% of support conversations. The other 98% — and the VOC inside them — lived in the dark. We built an LLM-as-judge to bring it into view.",
    metrics: [
      ["Audit coverage", "2% → 100%"],
      ["Scale", "1M+ convos / month"],
      ["Manual effort", "↓ 60%"],
      ["ARR contribution", "₹4Cr+ · 15 clients"],
    ],
    chips: ["LLM-as-judge", "Chain-of-Thought prompts", "Multi-tier review", "WER north-star"],
    visual: "auto-qa",
    readTime: "5 min read",
    sections: [
      {
        h: "The problem",
        body: "B2B enterprises were auditing only 2% of their support conversations. The other 98% — and the Voice of Customer inside them — lived in the dark. Leadership made decisions on a thin sample. Compliance gaps stayed hidden. Agent feedback loops broke at scale.",
      },
      {
        h: "The users",
        body: "Auditors (primary daily user) · CX leadership (visibility) · Support agents (feedback recipients) · A separate Zero Tolerance (ZT) escalation path for compliance-critical issues.",
      },
      {
        h: "The approach — 4 decisions",
        list: [
          ["LLM-as-judge over heuristic rules.", "Every enterprise has its own QA rubric — branding, scripts, compliance, tone. Hardcoded rules wouldn't scale across clients. We built an LLM judge that takes a configurable, business-specific prompt and scores conversations against it."],
          ["Parameter-driven prompts with Chain-of-Thought.", "Each QA parameter (Confidence Building, Branding, Opening, Closing, Latency) was structured as a 3-step CoT: applicability check → evidence extraction → structured scoring. Every score came with a reason — making the evals themselves auditable."],
          ["Multi-tier review workflow.", "L1 / L2 / L3 reviewers for disputes; a separate ZT (Zero Tolerance) lane for compliance-critical tickets. Humans stayed in the loop where stakes were highest. Automation handled the rest."],
          ["WER as north-star upstream metric.", "Bad transcription was silently corrupting evals. Treating Word Error Rate as a product KPI — not just an engineering one — forced investment in transcription quality as a first-class concern."],
        ],
      },
      {
        h: "What I learned",
        list: [
          ["AI didn't just automate audits — it exposed them.", "When we shipped, we expected to scale audit volume. What we didn't expect: the system surfaced inconsistencies in the human audit process itself — different auditors scoring the same conversation differently. The platform became a lens on the auditing system, not just a scaling layer for it."],
          ["Golden datasets are non-negotiable for LLM-as-judge.", "Without ground truth, you're auditing the auditor with no way to know if it's right. Manually-labeled golden sets per client slowed launch — but kept the evals trustworthy."],
          ["Garbage-in compounds.", "Low-quality transcription pushed us toward longer, defensive prompts — which slowed implementation and dragged onboarding for every new client. The real fix was upstream (better transcription), not a longer prompt."],
        ],
      },
    ],
  },
  {
    id: "auto-coaching",
    tag: "02 · Auto Coaching",
    meta: "Kapture CX · 2025 → present · 0→1 owner",
    title: "Auto-QA was the diagnosis. Auto Coaching is the cure.",
    pitch: "Audit scores told managers what was broken — but not how to fix it. Same agents, same mistakes, climbing escalations. We turned every Auto-QA insight into a personalized, SOP-grounded coaching plan delivered through gamified live mocks — and a measurable drop in escalations followed.",
    metrics: [
      ["Reach", "1,800 agents · 4 clients"],
      ["Agents coached", "1,500+"],
      ["Sessions delivered", "8,000+"],
      ["Targeting", "Bottom 20%, tailored"],
    ],
    chips: ["SOP-grounded plans", "Gamified live mocks", "Parameter-level targeting", "Closed-loop with Auto-QA"],
    visual: "coaching",
    readTime: "5 min read",
    sections: [
      {
        h: "The problem",
        body: "After Auto-QA exposed the audit gaps, support heads had a new problem: visibility without action. They could see scores per agent, per parameter — but no path from \"Greeting: 64%\" to \"here's how Divya improves.\" Coaching was opinion-based, slow, and didn't scale. The same agents kept making the same mistakes — escalations climbed, business suffered, and managers were stuck running 1:1s that didn't move the metric.",
      },
      {
        h: "The users",
        body: "Agents (trained via gamified live mock sessions) · Managers (deliver coaching, track progress) · CX Heads (org-level visibility).",
      },
      {
        h: "The approach — 4 decisions",
        list: [
          ["Coaching plans grounded in SOP + real conversations.", "Generic LLM tips read like ChatGPT advice. We anchored every coaching plan in two things: the client's own SOP/playbook (the rules) + the agent's actual recent conversations (the evidence). Specificity beats generality."],
          ["Gamified live mock as the training surface.", "Reading a coaching report doesn't change behavior. We built a live mock environment where agents role-play scenarios drawn from their own weak parameters — gamified to make repeated practice feel rewarding, not punitive."],
          ["Parameter-level targeting, not aggregate scores.", "\"Your score is 67%\" is useless. \"Your Empathy is 78%, Closing is 54% — here are 3 conversations where you could have done better, here's what to practice\" is actionable. The unit of coaching had to be the parameter, not the agent."],
          ["Closed loop with Auto-QA.", "Coaching only matters if scores improve. We closed the loop: Auto-QA evaluates → Auto Coaching prescribes → mock training delivers → next Auto-QA cycle measures the lift. The system sees its own impact."],
        ],
      },
      {
        h: "What I learned",
        list: [
          ["The bottom 20% is where coaching ROI lives.", "Spreading coaching evenly across 1,800 agents diluted impact. Identifying the bottom-quartile performers and tailoring plans for them specifically is what produced measurable lift — not blanket training."],
          ["Self-paced milestones beat scheduled 1:1s.", "Replacing mandatory manager 1:1s with self-paced, milestone-based progress changed the social contract — coaching went from \"your manager is checking on you\" to \"your skill level is leveling up.\" Motivation followed."],
          ["Closed loops compound trust.", "Auto-QA → Auto Coaching → next-cycle Auto-QA lift. When managers see the loop close, the platform graduates from \"AI feature\" to \"performance system.\""],
        ],
      },
    ],
  },
  {
    id: "knowledge-scraper",
    tag: "03 · GenAI Knowledge Scraper",
    meta: "Kapture CX · 2025 → present · 0→1 owner",
    title: "From 10,000 scattered docs to one searchable brain.",
    pitch: "Enterprise knowledge lived everywhere — websites, SOPs, PDFs, training videos, image-heavy diagrams. We built a RAG-powered KB that crawls, OCRs, embeds, and serves answers across chatbot, voicebot, and LMS — driving 90% chat deflection at a major financial services enterprise.",
    metrics: [
      ["Chat deflection", "90%"],
      ["Surfaces unified", "3 (chat · voice · LMS)"],
      ["Content types", "4 (web · pdf · vid · img)"],
      ["LLM choice", "Gemini (cost+speed)"],
    ],
    chips: ["RAG pipeline", "Vector DB", "OCR-first ingestion", "Multi-surface integrations"],
    visual: "kb",
    readTime: "5 min read",
    sections: [
      {
        h: "The problem",
        body: "Enterprise support content lived in chaos — websites, SOPs, PDFs, internal wikis, training videos, image-heavy diagrams. Customers asked questions; bots gave bad answers because the knowledge wasn't structured, searchable, or fresh. Agents wasted hours hunting for the right SOP. The cost: deflection rates that didn't justify bot investment, and rising support load.",
      },
      {
        h: "The users",
        body: "End customers (chatbot · voicebot) · Support agents (SOP retrieval) · Knowledge ops teams (KB maintenance) · Internal LMS users (training).",
      },
      {
        h: "The approach — 4 decisions",
        list: [
          ["Crawl → embed → retrieve → summarize. A full RAG pipeline.", "Not just a scraper, not just a chatbot. The system crawls source content (web, docs, videos, images), normalizes to markdown, embeds into a vector DB. At query time, the user's question gets embedded, top chunks retrieved, and an LLM summarizes with context. Each step optimized separately."],
          ["OCR on images, not just text scraping.", "Most enterprise SOPs have screenshots, flowcharts, diagrams — content standard scrapers miss. We added OCR as a first-class extractor so visual knowledge wasn't dropped on the floor."],
          ["Gemini over Llama for cost + speed.", "Benchmarked both on accuracy, latency, and per-query cost. Gemini hit the right balance for enterprise SLAs where response time matters as much as answer quality. Cost predictability won."],
          ["One KB, three surfaces — chatbot, voicebot, LMS.", "Built once, integrated three places. Chatbot for customer-facing deflection, voicebot for IVR augmentation, LMS for agent training. The KB became infrastructure, not just a feature."],
        ],
      },
      {
        h: "What I learned",
        list: [
          ["Pipelines beat models.", "Everyone obsesses over the LLM. The real wins came from the unsexy steps — crawling reliably, normalizing to markdown, choosing the right chunk size, embedding well. The LLM is the tip of the iceberg; the pipeline is the iceberg."],
          ["The unfashionable choice often wins.", "Picking Gemini over Llama, OCR over web scraping for image-heavy docs — these aren't the \"cool\" choices in 2025 PM circles. But they served the actual constraints: enterprise cost, latency SLAs, content fidelity. Discipline over fashion."],
          ["One KB, three surfaces is leverage.", "Same vector DB powers chatbot, voicebot, and LMS. Building the KB as platform — not feature — is what made the ROI compound. Future surfaces (agent assist, ticket triage) plug in nearly free."],
        ],
      },
    ],
  },
];

const PRINCIPLES = [
  ["The right problem first. The right solution second.", "Most product failures aren't bad solutions — they're well-built answers to the wrong question. I spend disproportionate time at the front end."],
  ["Decide with incomplete data. Adjust as you learn.", "Waiting for certainty is a tax on velocity. Make the call with what's on the table; rebuild the call when better data arrives."],
  ["Pipelines beat models.", "The LLM is the tip of the iceberg. The wins come from the unsexy steps underneath — data quality, context, evaluation, the loop."],
  ["Close the loop.", "A feature that can't measure its own impact is a guess. Build systems that see what they're doing — and adjust."],
];

const STACK = [
  ["Product", ["0→1 builds", "PRDs", "Roadmapping", "Opportunity sizing", "GTM", "Prioritization (RICE / MoSCoW)"]],
  ["Execution", ["Agile", "Sprint planning", "Stakeholder management", "Cross-functional collaboration", "Hypothesis validation"]],
  ["Data & tools", ["SQL", "A/B testing", "Funnel & cohort analysis", "Power BI", "JIRA", "Confluence", "Productboard", "Pendo", "Figma", "Miro", "Postman", "MongoDB", "Grafana", "Lovable"]],
  ["Domain", ["Enterprise SaaS", "CRM & CX", "GenAI features", "RAG", "LLM evals", "Workflow automation"]],
];

const WINS = [
  "National Semi-Finalist, TATA Steel-a-thon (top 1% of 1,500+ teams)",
  "Winner: Boeing & IIT innovation competitions",
  "Gold Medal, IIM Kashipur — Social impact track",
  "₹3L+ funding secured for national competition + final-year project",
];

/* ----------------------------- HELPERS ----------------------------- */

function useScrolled(threshold = 24) {
  const [s, set] = useState(false);
  useEffect(() => {
    const onScroll = () => set(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return s;
}

function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>;
}

/* ----------------------------- HERO VARIATIONS ----------------------------- */

function HeroClassic() {
  return (
    <div className="hero hero-classic">
      <div className="hero-text">
        <div className="hero-greet">I'm Maaz <span className="wave">👋</span></div>
        <div className="hero-role">AI product manager · b2b saas · 0→1 and 1→n</div>
        <h1 className="hero-headline">
          Building at the intersection of GenAI and customer experience.
        </h1>
        <p className="hero-sub">
          I help enterprises adopt AI where it matters — owning roadmaps end-to-end and driving revenue across the full journey:
        </p>
        <LifecycleChips />
        <HookBlock />
        <CTAs />
      </div>
      <div className="hero-photo-wrap">
        <img src="assets/maaz.jpeg" alt="Maaz Ulla" className="hero-photo" />
      </div>
    </div>
  );
}

function HeroEditorial() {
  return (
    <div className="hero hero-editorial">
      <div className="hero-editorial-top">
        <div>
          <div className="hero-greet">Maaz Ulla</div>
          <div className="hero-role">AI product manager · b2b saas</div>
        </div>
        <img src="assets/maaz.jpeg" alt="Maaz Ulla" className="hero-photo hero-photo-sm" />
      </div>
      <h1 className="hero-display">
        Building at the intersection of <em>GenAI</em> and <em>customer experience</em>.
      </h1>
      <p className="hero-sub">
        I help enterprises adopt AI where it matters — owning roadmaps end-to-end and driving revenue across the full journey:
      </p>
      <LifecycleChips />
      <HookBlock />
      <CTAs />
    </div>
  );
}

function HeroAsymmetric() {
  return (
    <div className="hero hero-asym">
      <div className="hero-asym-name">
        <div className="hero-greet small">I'm Maaz <span className="wave">👋</span></div>
        <div className="hero-asym-big">Maaz<br/>Ulla.</div>
        <div className="hero-role">AI product manager · b2b saas · 0→1 and 1→n</div>
      </div>
      <img src="assets/maaz.jpeg" alt="Maaz Ulla" className="hero-photo hero-photo-bleed" />
      <div className="hero-asym-body">
        <p className="hero-sub">
          Building at the intersection of GenAI and customer experience. I help enterprises adopt AI where it matters — owning roadmaps end-to-end and driving revenue across the full journey:
        </p>
        <LifecycleChips />
        <HookBlock />
        <CTAs />
      </div>
    </div>
  );
}

function LifecycleChips() {
  const stages = ["Pre-sales", "Solutioning", "Activation", "Retention"];
  return (
    <div className="lifecycle">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <span className="chip lifecycle-chip">{s}</span>
          {i < stages.length - 1 && <span className="lifecycle-arrow" aria-hidden>→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function HookBlock() {
  return (
    <div className="hook">
      <div className="hook-label">How I work</div>
      <div className="hook-quote">"The right problem first. The right solution second."</div>
    </div>
  );
}

function CTAs() {
  return (
    <div className="ctas">
      <a className="btn btn-primary" href="https://drive.google.com/file/d/1FeVwZYcpMAdueBUw_l-SdMdR21iOVwQm/view?usp=sharing" target="_blank" rel="noopener">Download resume <span className="btn-arrow">↗</span></a>
      <a className="btn btn-ghost" href="https://www.linkedin.com/in/syed-maaz-ulla-3aa99471/" target="_blank" rel="noopener">LinkedIn</a>
      <a className="btn btn-ghost" href="mailto:syed.maaz.u@gmail.com">Get in touch</a>
    </div>
  );
}

/* ----------------------------- CASE STUDY ----------------------------- */

function CaseStudy({ c, expanded, onToggle }) {
  return (
    <article className={`case ${expanded ? "is-open" : ""}`} id={c.id}>
      <div className="case-visual"><CaseVisual kind={c.visual} /></div>
      <div className="case-meta-row">
        <span className="chip case-tag">{c.tag}</span>
        <span className="case-meta">{c.meta}</span>
      </div>
      <h3 className="case-title">{c.title}</h3>
      <p className="case-pitch">{c.pitch}</p>
      <div className="metrics">
        {c.metrics.map(([k, v]) => (
          <div className="metric" key={k}>
            <div className="metric-label">{k}</div>
            <div className="metric-value">{v}</div>
          </div>
        ))}
      </div>
      <div className="tech-row">
        {c.chips.map((t) => <span key={t} className="chip tech-chip">{t}</span>)}
      </div>
      <div className="case-foot">
        <span className="case-readtime">{c.readTime}</span>
        <button className="case-toggle" onClick={onToggle} aria-expanded={expanded}>
          {expanded ? "Close case study" : "Read case study"}
          <span className="case-toggle-arrow">{expanded ? "↑" : "↓"}</span>
        </button>
      </div>
      <div className={`case-detail ${expanded ? "open" : ""}`}>
        <div className="case-detail-inner">
          {c.sections.map((s) => (
            <div className="case-section" key={s.h}>
              <h4 className="case-section-h">{s.h}</h4>
              {s.body && <p>{s.body}</p>}
              {s.list && (
                <ol className="case-list">
                  {s.list.map(([t, b], i) => (
                    <li key={i}>
                      <strong>{t}</strong> {b}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ----------------------------- CASE VISUALS (mocked dashboards) ----------------------------- */

function BrowserFrame({ url, children }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <div className="browser-dots"><i/><i/><i/></div>
        <div className="browser-url">{url}</div>
        <div className="browser-spacer" />
      </div>
      <div className="browser-body">{children}</div>
    </div>
  );
}

function CaseVisual({ kind }) {
  if (kind === "auto-qa") return (
    <BrowserFrame url="kapture.cx / auto-qa / conversations">
      <div className="dash dash-qa">
        <div className="dash-side">
          <div className="dash-logo">⏷ Auto-QA</div>
          <div className="dash-nav">
            <div className="dash-nav-item active">Conversations</div>
            <div className="dash-nav-item">Parameters</div>
            <div className="dash-nav-item">Disputes</div>
            <div className="dash-nav-item">ZT lane</div>
            <div className="dash-nav-item">Reports</div>
          </div>
        </div>
        <div className="dash-main">
          <div className="dash-h">
            <div>
              <div className="dash-eyebrow">Today · 14:23</div>
              <div className="dash-title">Conversations audited</div>
            </div>
            <div className="dash-stats">
              <div className="dash-stat"><b>1,284,902</b><span>this month</span></div>
              <div className="dash-stat accent"><b>100%</b><span>coverage</span></div>
            </div>
          </div>
          <div className="dash-table">
            {[
              ["#48211", "Divya R.", "Closing", 54, "warn"],
              ["#48198", "Karan T.", "Empathy", 88, "ok"],
              ["#48177", "Reema S.", "Branding", 71, "mid"],
              ["#48164", "Aman J.", "Compliance", 42, "bad"],
              ["#48151", "Priya N.", "Opening", 92, "ok"],
            ].map((r, i) => (
              <div className="dash-row" key={i}>
                <span className="m-id">{r[0]}</span>
                <span className="m-name">{r[1]}</span>
                <span className="m-param">{r[2]}</span>
                <div className="m-bar"><div className={`m-bar-fill ${r[4]}`} style={{ width: `${r[3]}%` }} /></div>
                <span className="m-val">{r[3]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );

  if (kind === "coaching") return (
    <BrowserFrame url="kapture.cx / auto-coaching / agent · divya-r">
      <div className="dash dash-coach">
        <div className="coach-h">
          <div>
            <div className="dash-eyebrow">Coaching plan · week 18</div>
            <div className="dash-title">Divya R.</div>
            <div className="dash-meta-line">Bottom 20% · 3 weak parameters</div>
          </div>
          <div className="coach-score">
            <svg viewBox="0 0 80 80" className="ring">
              <circle cx="40" cy="40" r="32" className="ring-bg" />
              <circle cx="40" cy="40" r="32" className="ring-fg" strokeDasharray="201" strokeDashoffset="76" transform="rotate(-90 40 40)"/>
            </svg>
            <div className="ring-num"><b>62</b><span>/100</span></div>
          </div>
        </div>
        <div className="coach-params">
          {[["Empathy", 78, "ok"], ["Closing", 54, "bad"], ["Branding", 64, "warn"]].map((p, i) => (
            <div className="coach-param" key={i}>
              <div className="cp-h"><span>{p[0]}</span><b>{p[1]}%</b></div>
              <div className="m-bar"><div className={`m-bar-fill ${p[2]}`} style={{ width: `${p[1]}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="coach-mocks">
          <div className="coach-mock-h">Live mocks this week</div>
          <div className="coach-mock-grid">
            {["Closing flow", "Empathy reframe", "Brand tone"].map((m, i) => (
              <div className="mock-card" key={i}>
                <div className="mock-card-h">{m}</div>
                <div className="mock-card-meta">3 scenarios · 12 min</div>
                <div className="mock-card-pill">Start</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );

  // kb
  return (
    <BrowserFrame url="finance-client.com / help">
      <div className="dash dash-kb">
        <div className="kb-page">
          <div className="kb-page-h">Help center</div>
          <div className="kb-page-body">
            <div className="kb-line w-80" />
            <div className="kb-line w-95" />
            <div className="kb-line w-70" />
            <div className="kb-line w-85" />
          </div>
        </div>
        <div className="kb-widget">
          <div className="kb-widget-h">
            <div className="kb-widget-title">Chat with us</div>
            <div className="kb-widget-x">×</div>
          </div>
          <div className="kb-widget-body">
            <div className="bubble user">How do I reset my UPI PIN?</div>
            <div className="bubble bot">
              You can reset it in 4 steps —
              <ol>
                <li>Open the app → <i>Profile</i></li>
                <li>Tap <i>UPI settings</i></li>
                <li>Choose <i>Reset PIN</i> and verify with debit card</li>
                <li>Enter and confirm a new 6-digit PIN</li>
              </ol>
              <div className="bubble-src">Source: <span>UPI · SOP v3.4</span></div>
            </div>
            <div className="bubble user">Got it, thanks!</div>
          </div>
          <div className="kb-widget-input">
            <span>Ask anything…</span>
            <div className="kb-widget-send">↑</div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ----------------------------- ROOT ----------------------------- */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#534AB7",
  "type": "geist",
  "hero": "classic",
  "theme": "light",
  "density": "comfortable"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const scrolled = useScrolled(40);
  const [openCase, setOpenCase] = useState(null);

  // theme/density on root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
    document.documentElement.setAttribute("data-density", t.density);
    document.documentElement.setAttribute("data-type", t.type);
    document.documentElement.style.setProperty("--accent", t.accent);
    // derived accent-soft
    document.documentElement.style.setProperty("--accent-soft", hexToSoft(t.accent));
  }, [t]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#top" className="nav-brand">Maaz</a>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#connect">Connect</a>
          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={() => setTweak("theme", t.theme === "light" ? "dark" : t.theme === "dark" ? "dim" : "light")}
            title={`Theme: ${t.theme}`}
          >
            {t.theme === "light" ? "☾" : t.theme === "dim" ? "◐" : "☀"}
          </button>
        </nav>
      </header>

      <main className="page" id="top">
        <section className="section section-hero">
          {t.hero === "classic" && <HeroClassic />}
          {t.hero === "editorial" && <HeroEditorial />}
          {t.hero === "asymmetric" && <HeroAsymmetric />}
        </section>

        <section className="section" id="about">
          <Eyebrow>About</Eyebrow>
          <h2 className="section-h">A bit about me</h2>
          <div className="about-grid">
            <div className="about-prose">
              <p>Give me an ambiguous problem and I'll build the scaffolding around it — piece by piece, until the bigger picture solves itself. That's been the thread from the BYJU'S floor to LeadSquared's CRM to Kapture's AI stack.</p>
              <p>The range of the role is what keeps me hooked — sitting with customers to find the real pain, with engineers to find what's possible, zooming out to read where the market's going. AI is my home because the field rewires itself every week, and that pace of learning is hard to find anywhere else.</p>
              <p>Off the desk, I play lawn tennis, keep learning about the product space, and spend time with family to reset.</p>
            </div>
            <aside className="about-side">
              <div className="about-side-h">Currently</div>
              <div className="about-side-row">
                <span className="ico">💼</span>
                <div>
                  <div className="ico-label">AI PM at Kapture CX</div>
                  <div className="ico-sub">GenAI Knowledge Base · Conversation Intelligence · Auto Coaching</div>
                </div>
              </div>
              <div className="about-side-row">
                <span className="ico">📍</span>
                <div><div className="ico-label">Bengaluru, India</div></div>
              </div>
              <div className="about-side-row">
                <span className="ico">🎓</span>
                <div><div className="ico-label">MBA, IIM Kashipur '24</div></div>
              </div>
              <div className="about-side-row">
                <span className="ico">💡</span>
                <div>
                  <div className="ico-label">Learning</div>
                  <div className="ico-sub">Prompt engineering, evals</div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="section" id="work">
          <Eyebrow>Featured case studies</Eyebrow>
          <h2 className="section-h">Selected work</h2>
          <div className="cases">
            {CASES.map((c) => (
              <CaseStudy key={c.id} c={c} expanded={openCase === c.id} onToggle={() => setOpenCase(openCase === c.id ? null : c.id)} />
            ))}
          </div>
        </section>

        <section className="section" id="think">
          <Eyebrow>Operating principles</Eyebrow>
          <h2 className="section-h">How I think</h2>
          <div className="principles">
            {PRINCIPLES.map(([h, b]) => (
              <div className="principle" key={h}>
                <div className="principle-h">{h}</div>
                <div className="principle-b">{b}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="stack">
          <Eyebrow>Stack</Eyebrow>
          <h2 className="section-h">What I work with</h2>
          <div className="stack">
            {STACK.map(([cat, items]) => (
              <div className="stack-row" key={cat}>
                <div className="stack-cat">{cat}</div>
                <div className="stack-chips">
                  {items.map((i) => <span className="chip stack-chip" key={i}>{i}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="wins">
          <Eyebrow>Outside work</Eyebrow>
          <h2 className="section-h">A few wins</h2>
          <ul className="wins">
            {WINS.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </section>

        <section className="section section-connect" id="connect">
          <Eyebrow>Connect</Eyebrow>
          <h2 className="section-h">Let's talk</h2>
          <p className="connect-prose">
            The best ideas come from conversations. If you're working on something at the intersection of AI and customer experience — or just want to swap notes on prompts, evals, or PM craft — I'd love to hear from you.
          </p>
          <div className="ctas">
            <a className="btn btn-primary" href="mailto:syed.maaz.u@gmail.com">Email <span className="btn-arrow">↗</span></a>
            <a className="btn btn-ghost" href="https://www.linkedin.com/in/syed-maaz-ulla-3aa99471/" target="_blank" rel="noopener">LinkedIn</a>
            <a className="btn btn-ghost" href="https://drive.google.com/file/d/1FeVwZYcpMAdueBUw_l-SdMdR21iOVwQm/view?usp=sharing" target="_blank" rel="noopener">Resume</a>
          </div>
        </section>

        <footer className="foot">
          © 2026 Maaz Ulla · Built with care
        </footer>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio label="Mode" value={t.theme} options={[{value:"light",label:"Light"},{value:"dim",label:"Dim"},{value:"dark",label:"Dark"}]} onChange={(v)=>setTweak("theme",v)} />
        </TweakSection>
        <TweakSection title="Accent">
          <TweakColor label="Accent color" value={t.accent} options={["#534AB7","#BA7517","#1F8A5B","#C8462C","#1a1a1a"]} onChange={(v)=>setTweak("accent",v)} />
        </TweakSection>
        <TweakSection title="Type">
          <TweakRadio label="Pairing" value={t.type} options={[{value:"geist",label:"Geist"},{value:"inter",label:"Inter"},{value:"fraunces",label:"Fraunces + Inter"}]} onChange={(v)=>setTweak("type",v)} />
        </TweakSection>
        <TweakSection title="Hero">
          <TweakRadio label="Layout" value={t.hero} options={[{value:"classic",label:"Classic"},{value:"editorial",label:"Editorial"},{value:"asymmetric",label:"Asymmetric"}]} onChange={(v)=>setTweak("hero",v)} />
        </TweakSection>
        <TweakSection title="Density">
          <TweakRadio label="Spacing" value={t.density} options={[{value:"comfortable",label:"Comfortable"},{value:"compact",label:"Compact"}]} onChange={(v)=>setTweak("density",v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function hexToSoft(hex) {
  // turn #RRGGBB into rgba with low alpha
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0,2),16);
  const g = parseInt(m.slice(2,4),16);
  const b = parseInt(m.slice(4,6),16);
  return `rgba(${r},${g},${b},0.08)`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
