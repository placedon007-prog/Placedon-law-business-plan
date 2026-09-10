import type { SVGProps, ReactNode } from "react";
import Link from "next/link";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${footer ? " brand-footer" : ""}`}
      aria-label="Placedon home"
    >
      <span className="brand-mark" aria-hidden="true" />
      <span>Placedon</span>
    </Link>
  );
}

export type MarkName =
  | "verified"
  | "abstained"
  | "provision"
  | "currency"
  | "instrument";
export function Mark({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: MarkName }) {
  const paths: Record<MarkName, ReactNode> = {
    verified: (
      <>
        <path d="m12 2 3 2 3.6.5.9 3.5 2 3-2 3-.9 3.5-3.6.5-3 2-3-2-3.6-.5L4.5 14l-2-3 2-3 .9-3.5L9 4Z" />
        <path d="m8 11 2.5 2.5L16 8" />
      </>
    ),
    abstained: (
      <>
        <path d="M5 3H3v18h2m14-18h2v18h-2M8 12h8" />
      </>
    ),
    provision: (
      <>
        <path d="M15.5 5c-1-2-6-2-7 1-1 4 8 4 7 8-1 3-6 3-7 1M8.5 19c1 2 6 2 7-1 1-4-8-4-7-8 1-3 6-3 7-1" />
      </>
    ),
    currency: (
      <>
        <path d="M3 12h18M6 5v4m6 6v4m6-14v4" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
      </>
    ),
    instrument: (
      <>
        <path d="M6 2h8l4 4v16H6ZM14 2v5h4M9 11h6m-6 4h6m-6 3h3" />
      </>
    ),
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M5 19 19 5M5 5h14v14" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

export function LegalText({ children }: { children: string }) {
  const parts = children.split(
    /(Companies Act, 2013|\b\d{4}-\d{2}-\d{2}\b|\bs\.\d+(?:\([a-z0-9]+\))*|G\.S\.R\.\s*\d+\([A-Z]\)|₹[\d,]+)/g,
  );
  return (
    <>
      {parts.map((part, index) =>
        index % 2 ? (
          <span className="citation-text" key={index}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
