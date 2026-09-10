"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, Fragment, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import "./dashboard.css";

/* ---------------------------------------------------------------- icons */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function Icon({ d, size = 30 }: { d: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden>
      {d}
    </svg>
  );
}
const I = {
  plug: <path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5" />,
  checks: (
    <>
      <path d="M3 6h11M3 12h11M3 18h11" />
      <path d="m18 5 2 2 3-3" />
    </>
  ),
  pen: <path d="M12 20h9M4 20l8.5-8.5a2.1 2.1 0 0 0-3-3L1 17v3Z" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M7 21h10M5 7h14l-3.5 6a3 3 0 0 1-6 0L5 7ZM3 7l3-3 6 1 6-1 3 3" />
    </>
  ),
  columns: (
    <>
      <path d="M12 4c-2-1.4-4.5-1.4-7 0v13c2.5-1.4 5-1.4 7 0M12 4c2-1.4 4.5-1.4 7 0v13c-2.5-1.4-5-1.4-7 0M12 4v14" />
    </>
  ),
  bag: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2M3 13h18" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 17h7M17.5 14v7" />
    </>
  ),
  feather: (
    <>
      <path d="M20 4a6 6 0 0 0-8.5 0L4 11.5V20h8.5L20 12.5a6 6 0 0 0 0-8.5ZM4 20 15 9M12 6h4v4" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8 7.5 11 16M16 7.5 13 16M8 6h8" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  file: (
    <>
      <path d="M6 2h8l4 4v16H6ZM14 2v5h4M9 12h6m-6 4h6" />
    </>
  ),
  book: (
    <>
      <path d="M4 4a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2ZM19 20H6a2 2 0 0 1-2-2" />
    </>
  ),
  arrowR: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowL: <path d="M20 12H5m6 6-6-6 6-6" />,
};

/* ------------------------------------- rotating / bobbing brand logo */
function BrandMark({ spin = false }: { spin?: boolean }) {
  const reduce = useReducedMotion();
  const animate = reduce ? {} : spin ? { rotate: 360 } : { y: [0, 3, 0] };
  const transition = spin
    ? { duration: 24, repeat: Infinity, ease: "linear" as const }
    : { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const };
  return (
    <motion.span
      style={{ display: "inline-flex" }}
      animate={animate}
      transition={transition}
      whileHover={reduce ? {} : { y: spin ? 0 : 3, scale: 1.06 }}
    >
      <Image src="/brand/placedon-white.png" alt="" width={23} height={26} />
    </motion.span>
  );
}

/* -------------------------------- section icon with a small wiggle */
function SecIcon({ d, size = 42 }: { d: ReactNode; size?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="dsec-icon">
      <motion.span
        style={{ display: "inline-flex", transformOrigin: "50% 55%" }}
        animate={reduce ? {} : { rotate: [0, 7, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon d={d} size={size} />
      </motion.span>
    </div>
  );
}

/* ---------------------------- heading with word-reveal typography */
const h2Container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const h2Word: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
  },
};
function AnimatedH2({ children }: { children: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <h2>{children}</h2>;
  const words = children.split(" ");
  return (
    <motion.h2
      variants={h2Container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span variants={h2Word} style={{ display: "inline-block" }}>
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.h2>
  );
}

/* ---------------------------------------- hero video (autoplay on view) */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // ensure muted so autoplay is allowed
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };
  return (
    <div className="dhero-video">
      <video
        ref={ref}
        src="/media/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onVolumeChange={() => {
          const v = ref.current;
          if (v) setMuted(v.muted);
        }}
      />
      <div className="dvideo-controls">
        <button
          className="dvideo-btn"
          onClick={togglePlay}
          aria-label={paused ? "Play video" : "Pause video"}
        >
          {paused ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7-11-7Z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M8 5v14M16 5v14" />
            </svg>
          )}
        </button>
        <button
          className="dvideo-btn"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M22 9l-6 6M16 9l6 6" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M16 9a3 3 0 0 1 0 6M19 7a7 7 0 0 1 0 10" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- reveal */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------- content */
const features = [
  {
    icon: I.plug,
    title: "Connected to your filings",
    body: "Placedon reads from MCA21 filings, board minutes, and your statutory registers — no re-keying, no copy-paste, no re-explaining the company each time you open a question.",
  },
  {
    icon: I.checks,
    title: "Built for your obligations",
    body: "Matrices for the duties the Act actually imposes: AGM timing under s.96, the board-meeting cadence under s.173, small-company status under s.2(85), and the Board's-report extracts.",
  },
  {
    icon: I.pen,
    title: "Works where you file",
    body: "Use Placedon in Word, in email, and alongside the secretarial software your team already runs. The citation travels with the answer wherever it goes.",
  },
  {
    icon: I.lock,
    title: "Abstains by design",
    body: "When a limb of a provision is undecided, Placedon says so and names the missing instrument. It never renders a fabricated figure to fill a gap.",
  },
];

const principles = [
  {
    icon: I.pen,
    step: "01 · Explain",
    title: "The model explains",
    body: "It translates a pre-verified packet into plain English. It never makes the decision.",
  },
  {
    icon: I.cpu,
    step: "02 · Decide",
    title: "Code decides",
    body: "Applicability is pure, deterministic code — testable without a network, the same every time.",
  },
  {
    icon: I.shield,
    step: "03 · Verify",
    title: "The record verifies",
    body: "Nothing reaches you while it is unverified. Abstention is the honest default, not an error.",
  },
];

type Demo = {
  tab: string;
  title: string;
  meta: string;
  blocks: { h: string; p: ReactNode; note?: ReactNode }[];
  prompt: string;
  connectors: string[];
};
const demos: Demo[] = [
  {
    tab: "AGM timing",
    title: "Compliance Note",
    meta: "Note No. PL-2026-014 · Companies Act, 2013",
    blocks: [
      {
        h: "1. Obligation",
        p: (
          <>
            Every company other than a One Person Company shall hold an annual
            general meeting each year under{" "}
            <span className="dcite">s.96(1)</span>, with not more than fifteen
            months between two meetings.
          </>
        ),
      },
      {
        h: "2. Timing",
        p: (
          <>
            The meeting must be held within six months of the close of the
            financial year. For the year ending{" "}
            <span className="dcite">2026-03-31</span>, the outer date is{" "}
            <span className="dcite">2026-09-30</span>.
          </>
        ),
        note: "First-AGM relief not applicable — company incorporated before this financial year. No Registrar extension under the s.96(1) proviso is on record.",
      },
    ],
    prompt:
      "Does our AGM deadline hold for FY 2025-26, and what is the exact date?",
    connectors: ["MCA21 Portal", "Board minutes"],
  },
  {
    tab: "Board meetings",
    title: "Compliance Note",
    meta: "Note No. PL-2026-021 · Companies Act, 2013",
    blocks: [
      {
        h: "1. Frequency",
        p: (
          <>
            A company shall hold a minimum of four board meetings every year
            under <span className="dcite">s.173(1)</span>, with not more than one
            hundred and twenty days between two consecutive meetings.
          </>
        ),
      },
      {
        h: "2. Standing",
        p: (
          <>
            Three meetings are held to date; the gap since the last meeting is{" "}
            <span className="dcite">96 days</span>. One further meeting is due
            before <span className="dcite">2026-10-14</span>.
          </>
        ),
      },
    ],
    prompt: "Are we on track for the s.173 board-meeting cadence this year?",
    connectors: ["Board minutes", "Secretarial software"],
  },
  {
    tab: "Small-company status",
    title: "Compliance Note",
    meta: "Note No. PL-2026-030 · Companies Act, 2013",
    blocks: [
      {
        h: "1. Test",
        p: (
          <>
            A small company is one whose paid-up capital and turnover do not
            exceed the limits prescribed under{" "}
            <span className="dcite">s.2(85)</span>.
          </>
        ),
      },
      {
        h: "2. Determination",
        p: <>Placedon abstains. No status is asserted without the instrument.</>,
        note: (
          <>
            The prescribed threshold depends on{" "}
            <span className="dcite">G.S.R. 700(E)</span>, which is not on record.
          </>
        ),
      },
    ],
    prompt: "Is the company a small company for FY 2025-26?",
    connectors: ["MCA21 Portal", "Financials"],
  },
  {
    tab: "Board's report",
    title: "Compliance Note",
    meta: "Note No. PL-2026-037 · Companies Act, 2013",
    blocks: [
      {
        h: "1. Extract",
        p: (
          <>
            The Board's Report carries the disclosures prescribed under Rule 8.
            The PoSH extract under{" "}
            <span className="dcite">Rule 8(5)(x)</span> attaches to companies
            other than a One Person Company and small companies.
          </>
        ),
        note: "Company is not a small company on record → the Rule 8(5)(x) extract attaches.",
      },
    ],
    prompt: "Draft the Board's-report disclosures that attach to us.",
    connectors: ["Registers", "Board minutes"],
  },
  {
    tab: "Registers",
    title: "Compliance Note",
    meta: "Note No. PL-2026-041 · Companies Act, 2013",
    blocks: [
      {
        h: "1. Statutory registers",
        p: (
          <>
            Every company shall keep the registers prescribed under{" "}
            <span className="dcite">s.88</span> — of members, debenture-holders,
            and other security holders — at its registered office.
          </>
        ),
        note: "Register of members present. Register of charges under s.85 not located — flagged for review.",
      },
    ],
    prompt: "Which statutory registers are missing from our record?",
    connectors: ["MCA21 Portal", "Registers"],
  },
];

const tools = [
  {
    icon: I.pen,
    title: "Placedon for Word",
    body: "Draft board resolutions, notices, and Board's-report extracts inside Word, each clause carrying its section and operative date.",
  },
  {
    icon: I.checks,
    title: "Placedon Matrix",
    body: "Hand off a company and get back the full obligation matrix — one row per duty, marked attaches, met, or missing.",
  },
  {
    icon: I.bag,
    title: "Plugins",
    body: "Add practice packs for corporate-secretarial, POSH, and annual-filing workflows, configured to your registers and calendar.",
  },
  {
    icon: I.network,
    title: "Platform",
    body: "Integrate Placedon into your secretarial or GRC system through the API and the evidence contract.",
  },
];

const build = [
  {
    icon: I.network,
    title: "MCP for statutory data",
    body: "Connect your registers, filings, and minute books to Placedon through the open Model Context Protocol.",
  },
  {
    icon: I.cpu,
    title: "Deterministic engine",
    body: "Every applicability decision is pure code, testable without a network. The model explains; it never decides.",
  },
  {
    icon: I.shield,
    title: "Built for sensitive data",
    body: "No employee-level PII, an audit trail on every answer, and abstention wherever the source is missing.",
  },
];

const resources = [
  { title: "How the record works", kind: "Explainer", icon: I.book },
  { title: "When Placedon abstains", kind: "Explainer", icon: I.lock },
  { title: "Source defects, preserved verbatim", kind: "Reference", icon: I.file },
  { title: "The frozen benchmark", kind: "Reference", icon: I.checks },
  { title: "AGM timing, end to end", kind: "Walkthrough", icon: I.feather },
  { title: "Reading the obligation matrix", kind: "Guide", icon: I.grid },
];

const footerCols = [
  {
    label: "Product",
    links: ["The record", "Placedon Matrix", "Placedon for Word", "Plugins", "Platform", "Pricing"],
  },
  {
    label: "Solutions",
    links: ["Company secretaries", "In-house counsel", "Advisors", "Startups", "Annual filings"],
  },
  {
    label: "Evidence",
    links: ["How the record works", "Abstention", "Source defects", "Benchmark", "Changelog"],
  },
  {
    label: "Company",
    links: ["About", "Careers", "Privacy", "Terms", "Contact"],
  },
];

/* small helper: ledger index eyebrow */
function Index({ n, label }: { n: string; label: string }) {
  return (
    <div className="dindex">
      <b>{n}</b> · {label}
    </div>
  );
}

/* ---------------------------------------------------------------- page */
export default function DashboardPage() {
  const [tab, setTab] = useState(0);
  const reduce = useReducedMotion();
  const active = demos[tab];

  return (
    <div className="dash">
      {/* NAV */}
      <header className="dnav">
        <div className="dash-container dnav-inner">
          <Link href="#top" className="dnav-brand" aria-label="Placedon">
            <BrandMark />
            Placedon
          </Link>
          <nav className="dnav-links" aria-label="Primary">
            <Link href="#product">Product</Link>
            <Link href="#solutions">Solutions</Link>
            <Link href="#evidence">Evidence</Link>
            <Link href="#resources">Resources</Link>
          </nav>
          <div className="dnav-actions">
            <Link href="#pilot" className="dnav-login">
              Log in
            </Link>
            <Link href="#pilot" className="dbtn dbtn-ghost">
              Contact
            </Link>
            <Link href="#pilot" className="dbtn dbtn-solid">
              Request a pilot
            </Link>
            <button className="dnav-burger" aria-label="Open menu">
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* breadcrumb */}
      <div className="dcrumb" id="top">
        <div className="dash-container dcrumb-inner">
          <span>
            Solutions <span className="sep">/</span> Placedon legal solutions
          </span>
          <span className="dcrumb-here">
            Explore here <Icon d={<path d="m6 9 6 6 6-6" />} size={16} />
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="dash-container dsection dhero dsection-flush">
        <Reveal>
          <span className="eyebrow">Placedon Legal Solutions</span>
          <h1>Compliance you can put in front of a judge.</h1>
          <p className="lead">
            Placedon answers Indian corporate-law questions with the exact
            provision, the amending instrument, and the operative date — and
            abstains when it cannot verify.
          </p>
          <div className="dhero-actions">
            <Link href="#pilot" className="dbtn dbtn-solid">
              Request a pilot
            </Link>
            <Link href="#evidence" className="dbtn dbtn-ghost">
              See the evidence
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <HeroVideo />
        </Reveal>
      </section>

      {/* STATEMENT + FEATURES */}
      <section id="product" className="dash-container dsection">
        <Reveal>
          <div className="dstatement">
            <SecIcon d={I.columns} size={42} />
            <Index n="01" label="The record" />
            <AnimatedH2>Built for the record</AnimatedH2>
            <p className="lead">
              Placedon reads the Companies Act, 2013, traces every answer to its
              source, and works inside the tools your compliance team already
              uses. Every output carries its citation and its operative date — or
              it abstains.
            </p>
          </div>
        </Reveal>

        <div className="dfeature-shell" style={{ marginTop: "clamp(48px,6vw,88px)" }}>
          <div className="dfeatures">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="dfeature-row">
                  <div className="dfeature-head">
                    <Icon d={f.icon} size={26} />
                    <span className="dfeature-title">{f.title}</span>
                  </div>
                  <p className="dfeature-body">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <aside className="daside">
              <div className="daside-title">Evidence over confidence</div>
              <div className="daside-chips">
                <span className="chip chip-met">Verified</span>
                <span className="chip chip-attaches">Attaches</span>
                <span className="chip chip-abstain">Abstained</span>
              </div>
              <p>
                Every answer traces to a provision, an instrument, and an
                operative date. Nothing ships while it cannot be verified.
              </p>
              <button className="dbtn dbtn-link">
                How the record works
                <span className="dbtn-arrow">
                  <Icon d={I.arrowR} size={16} />
                </span>
              </button>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="evidence" className="dash-container dsection">
        <Reveal>
          <div className="dcenter" style={{ marginBottom: 44 }}>
            <SecIcon d={I.feather} size={42} />
            <Index n="02" label="In practice" />
            <AnimatedH2>How compliance teams use Placedon</AnimatedH2>
          </div>
        </Reveal>

        <Reveal>
          <div className="ddemo-tabs" role="tablist" aria-label="Use cases">
            {demos.map((d, i) => (
              <button
                key={d.tab}
                role="tab"
                aria-selected={i === tab}
                data-active={i === tab}
                className="ddemo-tab"
                onClick={() => setTab(i)}
              >
                {d.tab}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="ddemo-stage">
            <div className="ddoc">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  className="ddoc-paper"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h4>{active.title}</h4>
                  <div className="ddoc-meta mono">{active.meta}</div>
                  {active.blocks.map((b, i) => (
                    <div key={i}>
                      <div className="ddoc-h">{b.h}</div>
                      <p className="ddoc-p">{b.p}</p>
                      {b.note && <div className="ddoc-note">{b.note}</div>}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="dcol">
              <div className="dcard">
                <div className="dcard-label">Prompt</div>
                <div className="dcard-prompt">{active.prompt}</div>
              </div>
              <div className="dcard">
                <div className="dcard-label">Connectors</div>
                {active.connectors.map((c) => (
                  <div className="dconn" key={c}>
                    <span className="dconn-mark" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TOOLS */}
      <section id="solutions" className="dash-container dsection">
        <Reveal>
          <div className="dcenter" style={{ marginBottom: 20 }}>
            <SecIcon d={I.bag} size={42} />
            <Index n="03" label="Tools" />
            <AnimatedH2>Tools made for the way you work</AnimatedH2>
          </div>
        </Reveal>
        <div className="dfeatures">
          {tools.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="dfeature-row">
                <div className="dfeature-head">
                  <Icon d={f.icon} size={26} />
                  <span className="dfeature-title">{f.title}</span>
                </div>
                <div>
                  <p className="dfeature-body">{f.body}</p>
                  <button className="dbtn dbtn-link dfeature-learn">
                    Learn more
                    <span className="dbtn-arrow">
                      <Icon d={I.arrowR} size={16} />
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRINCIPLES — the golden rule */}
      <section className="dash-container dsection">
        <Reveal>
          <div className="dcenter" style={{ marginBottom: 44 }}>
            <SecIcon d={I.scale} size={42} />
            <Index n="04" label="The standard" />
            <AnimatedH2>The model may propose. The system must verify.</AnimatedH2>
          </div>
        </Reveal>
        <div className="prin-grid">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className="prin-card">
              <Icon d={p.icon} size={28} />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <span className="prin-step">{p.step}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BUILD */}
      <section className="dash-container dsection">
        <Reveal>
          <div className="dcenter">
            <SecIcon d={I.grid} size={42} />
            <Index n="05" label="Platform" />
            <AnimatedH2>Build legal products with Placedon</AnimatedH2>
            <p className="lead" style={{ marginTop: 22 }}>
              Embed the record into your platform through the API and the
              evidence contract.
            </p>
          </div>
        </Reveal>
        <div className="dbuild-grid">
          {build.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06} className="dbuild-col">
              <Icon d={b.icon} size={28} />
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESOURCES — motif + serif title */}
      <section id="resources" className="dash-container dsection">
        <Reveal>
          <div className="dcenter">
            <SecIcon d={I.feather} size={40} />
            <Index n="06" label="Evidence" />
            <AnimatedH2>Evidence &amp; resources</AnimatedH2>
          </div>
        </Reveal>
        <div className="dres-grid">
          {resources.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 0.05} className="dres-card">
              <div className="dres-motif">
                <Icon d={r.icon} size={30} />
              </div>
              <div className="dres-foot">
                <div className="dres-title">{r.title}</div>
                <span className="dres-kind">
                  <Icon d={I.arrowR} size={14} />
                  {r.kind}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="dash-container dsection">
        <Reveal>
          <div className="dband">
            <span className="dband-icon">
              <Icon d={I.scale} size={34} />
            </span>
            <h3>Placedon for Indian corporate law</h3>
            <Link href="#pilot" className="dbtn dbtn-ghost">
              Learn more
              <Icon d={I.arrowR} size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* SECONDARY HERO */}
      <section id="pilot" className="dash-container dsection dhero2">
        <Reveal>
          <AnimatedH2>See what Placedon does for compliance teams</AnimatedH2>
          <p className="lead">
            Whether you are an in-house secretary scaling filings or an advisor
            building on the record, we will help you find where to start.
          </p>
          <div className="dhero2-actions">
            <Link href="#pilot" className="dbtn dbtn-solid">
              Request a pilot
            </Link>
            <Link href="#evidence" className="dbtn dbtn-ghost">
              See the evidence
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="dfoot">
        <div className="dash-container">
          <div className="dfoot-top">
            <div>
              <Link href="#top" className="dnav-brand" aria-label="Placedon">
                <BrandMark spin />
                Placedon
              </Link>
              <div className="dfoot-ask">
                How can I help you today?
                <span>
                  <Icon d={I.arrowR} size={16} />
                </span>
              </div>
            </div>
            <div className="dfoot-cols">
              {footerCols.map((col) => (
                <div className="dfoot-col" key={col.label}>
                  <div className="dfoot-col-label">{col.label}</div>
                  {col.links.map((l) => (
                    <Link href="#top" key={l}>
                      {l}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="dfoot-bottom">
            <span>
              © <span className="mono">2026</span> Placedon
            </span>
            <span>A witness, not a tool.</span>
            <span>Not legal advice.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
