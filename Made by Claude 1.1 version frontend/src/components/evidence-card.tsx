"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mark } from "./brand";
import {
  answerClasses,
  evidencePreview,
} from "@/lib/placedon-content/content/shared";
import type { AnswerClass } from "@/lib/placedon-content/content/types";

export function EvidenceCard({ animate = false }: { animate?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="evidence-shell"
      initial={false}
      animate={
        animate && !reduced ? { y: [12, 0], opacity: [0, 1] } : undefined
      }
      transition={{ duration: 0.8 }}
    >
      <div className="evidence-card">
        <div className="evidence-toolbar">
          <span className="evidence-title">
            <Mark name="instrument" /> Evidence record
          </span>
          <span className="record-tag">Concept</span>
        </div>
        <div className="evidence-question">
          <span className="small muted-light">Question under review</span>
          <p>{evidencePreview.question}</p>
        </div>
        <div className="evidence-verdict">
          <div className="abstain-sign">
            <Mark name="abstained" />
          </div>
          <span className="mono state-label">Abstained</span>
          <h2>No verified answer.</h2>
          <p>
            The required evidence has not been established. No legal result is
            supplied.
          </p>
        </div>
        <dl className="evidence-fields">
          {evidencePreview.fields.map((field) => (
            <div key={field.key}>
              <dt>{field.label}</dt>
              <dd>
                {field.missing}
                <span aria-hidden="true">—</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="evidence-foot">
          <span className="status-dot" aria-hidden="true" />
          <span>Product concept — not a live answer</span>
        </div>
      </div>
      <p className="artifact-caption">The absence of evidence stays visible.</p>
    </motion.div>
  );
}

export function AnswerExplorer() {
  const [active, setActive] = useState<AnswerClass | "abstained">(
    "verified_fact",
  );
  const tabs = [
    ...Object.entries(answerClasses).map(([key, value]) => ({
      key: key as AnswerClass | "abstained",
      label: value.label,
    })),
    { key: "abstained" as const, label: "Abstained" },
  ];
  const answer = active === "abstained" ? null : answerClasses[active];
  return (
    <div className="answer-explorer">
      <div
        className="answer-tabs"
        role="tablist"
        aria-label="Intended answer classes"
      >
        {tabs.map((tab, index) => (
          <button
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-controls={`panel-${active}`}
            aria-selected={active === tab.key}
            tabIndex={active === tab.key ? 0 : -1}
            key={tab.key}
            onClick={() => setActive(tab.key)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setActive(tabs[next].key);
              document.getElementById(`tab-${tabs[next].key}`)?.focus();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className={`answer-panel ${!answer ? "answer-abstained" : ""}`}
      >
        <Mark
          name={
            !answer
              ? "abstained"
              : active === "verified_fact"
                ? "verified"
                : active === "deterministic_conclusion"
                  ? "provision"
                  : "currency"
          }
        />
        <div>
          <span className="small mono">
            {answer?.shortLabel ?? "No legal answer supplied"}
          </span>
          <h3>{answer?.claim ?? "The evidence cannot be established."}</h3>
          <p>
            {answer?.basis ??
              "An unresolved source, operative date, or company fact prevents a supported answer."}
          </p>
          <p className="answer-boundary">
            {answer?.boundary ??
              "An abstention does not establish that no obligation exists."}
          </p>
        </div>
      </div>
    </div>
  );
}
