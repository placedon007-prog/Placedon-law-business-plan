# Template — for review by counsel; not legal advice.

# Cookies and data collection

**Status:** Proposed notice and banner copy. Confirm the actual storage inventory before publication. The exact importable banner strings are in `content/system.ts`; this document explains the intended behaviour.

## Banner copy

**Title:** Choose whether to allow analytics.

**Body:** Required storage supports the site and remembers your choice. Optional analytics would measure page use only if you allow it; refusing does not affect the request form.

**Actions:** “Allow analytics” · “Reject optional analytics” · “Cookie preferences”

**Links:** “Privacy policy” → `/privacy` · “Cookies and data collection” → `/cookies`

**Default:** Optional analytics off. Consent is not inferred from scrolling, closing a panel, browsing, or submitting a request.

Where no analytics provider is configured, omit the invitation to allow analytics. Show the data-collection explanation and a preferences control that reports: “Optional analytics is not configured. No analytics choice will enable tracking.” Do not display a consent request for tracking that does not exist.

## Preference panel

**Required storage:** Limited to functions such as recording your consent choice and protecting form submission. This category cannot include audience measurement or advertising.

**Optional analytics:** Page-use measurement, enabled only after consent and only when a provider and its data practices are disclosed.

**Save:** Save preferences  
**Close:** Close preferences  
**Footer control:** Cookie preferences

Allow and reject controls must be equally available, with comparable prominence and no preselected optional toggle. A closed panel keeps the existing choice; without a recorded affirmative choice, analytics stays off. Failure to load or save consent keeps analytics off.

The planned preference record contains only the analytics choice, notice version, and choice time. It expires after 6 months, or earlier when a changed purpose requires renewed consent. It must not become a cross-site identifier.

On withdrawal, stop future optional events, remove optional identifiers under the site's control, and stop or unload the provider where technically possible. Do not replay page visits or form events collected before consent. An unsubscribe from emails and a withdrawal of analytics consent are separate choices.

## Data-collection explainer

**A visit:** Hosting may process an IP address and minimal request information to deliver and protect the site. This is separate from optional analytics. The published privacy policy must identify the actual host, logs, processing locations, and retention.

**A waitlist request:** The form needs an email address and consent to record interest and send access updates. Name, organisation, and role are optional.

**A pilot enquiry:** The form also needs a non-confidential workflow description and consent to assess and reply to the enquiry. It does not accept documents or request filing credentials.

**Additional updates:** A separate unchecked option asks whether to send occasional development updates. Refusal does not affect either request type.

**Optional analytics:** No event may be sent before opt-in. If enabled, the proposed event data is limited to page path, broad device category, and event time; it must exclude personal form fields, request references, and query parameters. No advertising, session recording, or cross-site tracking is proposed.

**Your choices:** Use “Cookie preferences” to change analytics consent. Use the privacy contact in `/privacy` to withdraw a request or ask about records already held. The form must not be the only route for a privacy request.

## Storage inventory to complete before publication

| Category                       | Identifier                          | Provider and domain                  | Purpose                                                       | Proposed expiry                                   | Status                                  |
| ------------------------------ | ----------------------------------- | ------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------- |
| Required preference            | {{CONSENT_STORAGE_KEY}}             | {{FIRST_PARTY_DOMAIN}}               | Remember the consent choice and notice version                | 6 months                                          | Confirm actual implementation           |
| Required submission protection | {{FORM_PROTECTION_STORAGE_OR_NONE}} | {{FORM_PROTECTION_PROVIDER_OR_NONE}} | Protect submission integrity, if browser storage is necessary | {{FORM_PROTECTION_EXPIRY_OR_NOT_APPLICABLE}}      | Remove this row if none is used         |
| Optional analytics             | {{ANALYTICS_STORAGE_OR_DISABLED}}   | {{ANALYTICS_PROVIDER_OR_DISABLED}}   | Consented page-use measurement only                           | {{ANALYTICS_IDENTIFIER_EXPIRY_OR_NOT_APPLICABLE}} | Disabled until configured and disclosed |

List local storage and similar browser storage as well as cookies. Do not label third-party tracking “required” merely because a vendor loads it by default. If provider-side data retention differs from browser expiry, state both in the privacy notice.

## Builder verification

Before enabling collection, inspect requests and browser storage before a choice, after rejection, after opt-in, after withdrawal, after expiry, and when storage is unavailable. Consent is purpose-specific; form consent cannot enable analytics. Both server and client must enforce the selected purpose and current notice version.

Ensure optional events are absent before consent, including network calls caused by script loading, tag managers, embedded media, or remote fonts. The brand fonts must be self-hosted. The supplied content does not implement any cookie, analytics provider, banner component, or network control.
