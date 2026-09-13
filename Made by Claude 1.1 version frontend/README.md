# Placedon web

Pre-launch marketing site with eight content routes, legal notices, evidence concepts, and closed-by-default registration. No live legal answers, analytics, payment collection, or invented statutory values are presented.

## Run locally

Use the dependencies already installed in this project. The existing Next.js 16.3.4 installation was retained instead of downgrading to the version in the original brief.

```sh
npm run dev
```

Production verification:

```sh
npm run lint
npm run build
npm run start -- --port 3100
node tests/contracts.mjs
```

Contract tests require Node 22.15 or later and use the installed TypeScript compiler. They mock outbound requests and never submit data to a provider. Browser tests use an available Playwright installation, not a runtime dependency of this site:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node tests/browser.mjs
```

Set `TEST_ORIGIN` for a different preview port. Browser tests expect closed registration. Screenshots go to the ignored `verification-artifacts` directory.

## Pages and content

| Route                                                          | Implementation                                                              |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/`                                                            | Editorial home with an explicitly unresolved evidence record                |
| `/product`, `/how-it-works`, `/pricing`, `/security`, `/about` | Typed content with route-specific introductions and sections                |
| `/faq`                                                         | All 18 Q&As, native disclosure controls, matching schema when configured    |
| `/waitlist`                                                    | Waitlist form; `?intent=pilot` selects pilot fields and consent             |
| `/privacy`, `/terms`, `/cookies`                               | Counsel-review templates; cookies page describes this implementation        |
| `/thank-you`                                                   | Unconfirmed direct-visit state; actual submission success stays in the form |
| Unknown routes                                                 | Real 404 response                                                           |
| `/og/placedon.png`, `/icon.svg`                                | Generated share image and brand icon                                        |

`src/lib/placedon-content` is a local snapshot of the separate content package. Components import its typed copy and metadata without requiring the sibling folder at runtime. Update the snapshot intentionally when its source changes. The original cookie template is retained for future configuration; the rendered page describes the current no-analytics build rather than exposing builder instructions.

Typography uses local Fraunces, Inter, and IBM Plex Mono. The share-image renderer uses a static Fraunces instance because its parser cannot render the supplied variable font reliably. Additional fonts retain OFL licences. Colours live in the CSS token block and server-image palette; components do not specify colour literals.

## Configuration and launch gates

See `.env.example`. Never commit real secrets.

- Set a confirmed HTTPS `SITE_ORIGIN` before building canonical URLs and structured data. Without it, pages remain noindex and schema URLs are omitted.
- Set `SITE_PUBLICATION_READY=true` only after publication review; rebuild after changing these build-time metadata settings. Draft legal documents remain noindex.
- Intake requires `WAITLIST_ENABLED=true`, an HTTPS sink, `LEGAL_REVIEW_CONFIRMED=true`, every legal template token in `LEGAL_DETAILS_JSON`, and current non-draft consent and privacy notice versions. `PRIVACY_NOTICE_VERSION` must match the rendered legal details.
- Identity, privacy contact, retention, processors, locations, and applicable terms require factual completion and counsel review. Configuration is not a substitute for review. Templates remain labelled as such.
- Missing configuration makes registration unavailable. The server validates consent, purpose, field lengths, honeypot, same-origin requests, and an 8 KiB body limit.
- Optional analytics is absent. Preferences do not request permission for a nonexistent tracker. Local storage only remembers appearance.

## Storage and confirmation contracts

The sink receives validated fields, request UUID, separate consent flags, notice versions, and server receipt time. It must persist before returning a successful receipt:

```json
{ "stored": true, "requestId": "the-same-request-UUID", "duplicate": false }
```

It must enforce `Idempotency-Key`, deduplicate retries, and reject reuse with conflicting data. Retries retain their UUID only while the payload is unchanged. A timeout is uncertain: the form does not assert that nothing was stored. No local fallback holds contact records.

An optional confirmation hook receives only UUID, email, and purpose after storage confirmation. It must honour the same idempotency key and return JSON with `sent: true` and the same `requestId` only after dispatch. A generic HTTP success is insufficient and dispatch is not proof of inbox delivery. No email is sent by this repository itself.

The in-process throttle is a development safeguard, not distributed abuse protection. Before opening intake, enforce rate, body, and time limits at the trusted hosting edge. Strip or replace client-supplied forwarding headers. Configure access-log retention and redaction; this route does not log form bodies or provider errors.

## Product API boundary

`src/lib/api.ts` provides `MockProvider` and `HttpProvider` for `/v1/compliance-pack`, `/v1/company/{cin}/standing`, `/v1/company/{cin}/events`, and a provisional `/v1/health` check. No live provider is enabled in the marketing experience. Mock answers abstain; mock event lists are fixtures, not statements about an official record.

The brief supplies endpoint paths and answer classes but no OpenAPI definition. Wire envelopes are provisional: reconcile them with the actual backend before connecting. Runtime checks validate response shape, not legal truth or source authenticity. Malformed pack/standing evidence becomes abstention; event failures throw instead of masquerading as an empty history. Backend verification, authorisation, and source controls remain required before live use.

## Publication checklist

Complete counsel and privacy review; test real sink deduplication and deletion; verify confirmation semantics; add trusted-edge abuse protection; review domain and indexing; reconcile the backend contract before introducing live data. Perform assistive-technology and deployed-host checks in addition to automated tests. This task did not deploy or push the site.
