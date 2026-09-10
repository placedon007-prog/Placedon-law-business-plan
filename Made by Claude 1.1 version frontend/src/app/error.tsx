"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container system-page">
      <h1>This page could not be loaded.</h1>
      <p>
        Try loading it again. No legal result is supplied while the page is
        unavailable.
      </p>
      <button type="button" className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
