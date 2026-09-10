"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { systemContent } from "@/lib/placedon-content/content/system";

/** No analytics vendor or tracking script is enabled in this pre-launch build. */
export function ConsentPreferences() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState("");
  function close() {
    dialog.current?.close();
    opener.current?.focus();
  }
  return (
    <>
      <button
        ref={opener}
        className="footer-control"
        onClick={() => dialog.current?.showModal()}
      >
        Cookie preferences
      </button>
      <dialog
        ref={dialog}
        className="consent-dialog"
        aria-labelledby="consent-title"
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="dialog-content">
          <div className="dialog-heading">
            <h2 id="consent-title">Cookie preferences</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Close preferences"
              onClick={close}
            >
              ×
            </button>
          </div>
          <p>{systemContent.consent.analyticsUnavailable}</p>
          <div className="preference-row">
            <span>Optional analytics</span>
            <span className="mono">Off</span>
          </div>
          <p className="small">
            This preview uses no analytics cookies. A saved appearance
            preference stays on this device and is used only to display the
            site.
          </p>
          <Link className="text-link" href="/cookies" onClick={close}>
            Read the data-collection notice
          </Link>
          <button
            type="button"
            className="button"
            onClick={() => {
              try {
                localStorage.removeItem("placedon-analytics");
                setMessage("Optional analytics remains off.");
              } catch {
                setMessage(
                  "Optional analytics remains off. Device storage is unavailable.",
                );
              }
            }}
          >
            Keep optional analytics off
          </button>
          <p role="status" className="small">
            {message}
          </p>
        </div>
      </dialog>
    </>
  );
}
