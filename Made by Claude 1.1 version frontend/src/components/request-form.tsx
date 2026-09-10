"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { formContent } from "@/lib/placedon-content/content/waitlist";
import type { FormFieldCopy } from "@/lib/placedon-content/content/types";
type Intent = "waitlist" | "pilot";
export function RequestForm({
  initialIntent,
  enabled,
  noticeVersion,
  consentVersion,
}: {
  initialIntent: Intent;
  enabled: boolean;
  noticeVersion: string;
  consentVersion: string;
}) {
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [invalid, setInvalid] = useState<string[]>([]);
  const requestId = useRef<string | null>(null);
  const fingerprint = useRef("");
  const form = useRef<HTMLFormElement>(null);
  const copy = formContent.purposes[intent];
  function changeIntent(next: Intent) {
    if (pending) return;
    setIntent(next);
    setInvalid([]);
    setFeedback("");
    requestId.current = null;
    const box = form.current?.elements.namedItem(
      "requestConsent",
    ) as HTMLInputElement | null;
    if (box) box.checked = false;
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || pending) return;
    setPending(true);
    setFeedback("");
    setInvalid([]);
    const data = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(data),
      intent,
      requestConsent: data.get("requestConsent") === "on",
      productUpdatesConsent: data.get("productUpdatesConsent") === "on",
      noticeVersion,
      consentVersion,
    };
    const nextFingerprint = JSON.stringify(payload);
    if (!requestId.current || fingerprint.current !== nextFingerprint) {
      requestId.current = crypto.randomUUID();
      fingerprint.current = nextFingerprint;
    }
    const body = { ...payload, requestId: requestId.current };
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (
        response.ok &&
        result.stored === true &&
        result.requestId === requestId.current
      ) {
        setSuccess(true);
        if (result.emailStatus === "failed")
          setFeedback(formContent.successEmailFailed);
        else if (result.emailStatus !== "sent")
          setFeedback(formContent.successEmailPending);
      } else {
        const key = result.error as keyof typeof formContent.errors;
        setFeedback(
          formContent.errors[key]?.description ??
            formContent.errors.storageFailure.description,
        );
        if (Array.isArray(result.fields)) {
          const fields = result.fields.filter(
            (field: unknown): field is string => typeof field === "string",
          );
          setInvalid(fields);
          const first = form.current?.elements.namedItem(
            fields[0],
          ) as HTMLElement | null;
          requestAnimationFrame(() => first?.focus());
        }
      }
    } catch {
      setFeedback(formContent.errors.networkUncertain.description);
    } finally {
      setPending(false);
    }
  }
  if (success)
    return (
      <div className="request-form" role="status">
        <p className="eyebrow">Request recorded</p>
        <h2>{copy.success.title}</h2>
        <p>{copy.success.description}</p>
        {feedback && <p className="form-feedback">{feedback}</p>}
        <Link className="text-link" href={copy.success.action.href}>
          {copy.success.action.label}
        </Link>
      </div>
    );
  return (
    <form
      ref={form}
      className="request-form"
      onSubmit={submit}
      aria-label={formContent.formLabel}
    >
      <div className="intent-controls" aria-label="Request type">
        {(["waitlist", "pilot"] as const).map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={intent === value}
            onClick={() => changeIntent(value)}
            disabled={pending}
          >
            {formContent.purposes[value].label}
          </button>
        ))}
      </div>
      {!enabled && (
        <div className="form-notice">
          <strong>{formContent.errors.unavailable.title}</strong>
          {formContent.errors.unavailable.description}
        </div>
      )}
      <p className="small muted">{copy.description}</p>
      <fieldset
        disabled={!enabled || pending}
        style={{ border: 0, padding: 0, margin: 0 }}
      >
        <legend className="sr-only">Contact details and consent</legend>
        {(copy.fields as readonly FormFieldCopy[]).map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              <span>{field.required ? "Required" : "Optional"}</span>
            </label>
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                defaultValue=""
                aria-describedby={`${field.name}-help`}
                aria-invalid={invalid.includes(field.name)}
              >
                {field.options?.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                maxLength={field.maxLength}
                aria-describedby={`${field.name}-help`}
                aria-invalid={invalid.includes(field.name)}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                maxLength={field.maxLength}
                autoComplete={field.autocomplete}
                aria-describedby={`${field.name}-help`}
                aria-invalid={invalid.includes(field.name)}
              />
            )}
            <p id={`${field.name}-help`} className="field-help">
              {field.help}
            </p>
            {invalid.includes(field.name) && (
              <p className="field-error">Review this field and try again.</p>
            )}
          </div>
        ))}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="requestConsent"
            name="requestConsent"
            required
          />
          <label htmlFor="requestConsent">{copy.consent.label}</label>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="productUpdatesConsent"
            name="productUpdatesConsent"
          />
          <label htmlFor="productUpdatesConsent">
            {formContent.optionalUpdates.label}
          </label>
        </div>
      </fieldset>
      {feedback && (
        <div className="form-feedback" role="alert">
          {feedback}
        </div>
      )}
      <button
        className="button form-submit"
        type="submit"
        disabled={!enabled || pending}
      >
        {pending ? copy.pendingLabel : copy.submitLabel}
      </button>
      <p className="form-smallprint">
        {formContent.submitNotice}
        <br />
        <Link href="/privacy">Privacy policy</Link> ·{" "}
        <Link href="/terms">Terms</Link>
      </p>
      <span className="sr-only" role="status">
        {pending ? formContent.progressAnnouncement : ""}
      </span>
    </form>
  );
}
