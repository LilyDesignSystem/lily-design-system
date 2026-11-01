# NGI Zero Commons Fund application: draft, not submitted

> [!WARNING]
> **DRAFT. NOT SUBMITTED. DO NOT SUBMIT THIS TEXT.**
>
> 1. **The NGI Zero Commons Fund is closed.** Its thirteenth and final call
>    closed on 2026-06-01. The NLnet funds open now are Restack and CodeSupply.
>    Their next deadline is **2026-11-03 at 12:00 CET**. Neither names
>    accessibility or front-end component libraries in its scope (see
>    "Verified facts" below).
> 2. **NLnet's generative AI policy forbids AI-written proposals.** Version 2.0
>    (2026-10-20) says: "It is not allowed to use generative AI during the
>    writing of proposals." An AI agent prepared this file. It is planning
>    material for the maintainer: facts, structure, and figures to check. The
>    maintainer must write the proposal text himself. None of the wording
>    below may be pasted into an NLnet form.
> 3. **NLnet restricts generative AI during funded work.** For project
>    development, generative AI is limited to read-only use. Proposals must
>    also disclose any significant amount of AI-generated code already in the
>    codebase. [AI_STATEMENT.md](../../AI_STATEMENT.md) §5 records that Lily's
>    implementations, tests, documentation and spec are ai-generated. Any
>    application has to disclose that, and any fixes the grant pays for would
>    have to be written by people.

Prepared 2026-10-29 for plan task P16-T8 from
[docs/audit-readiness.md](../audit-readiness.md). The funding record lives in
[spec/free-open-source-funding](../../spec/free-open-source-funding/index.md).

## Verified facts (accessed 2026-10-29)

| Fact                                                                                                                                                                                                                                                                                                                                            | Source                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| The Commons Fund's "thirteenth and final call ... closed on June 1st 2026"; "No more new applications are sought for this fund"                                                                                                                                                                                                                 | <https://nlnet.nl/commonsfund/>                                                                                |
| NLnet paused open calls while it evaluated NGI Zero (2026-06-12), with Restack, CodeSupply and ELFA to follow                                                                                                                                                                                                                                   | <https://nlnet.nl/news/2026/20260612-NGIZero-stocktaking.html>                                                 |
| Open now: Restack and CodeSupply. Deadline "November 3rd 2026 12:00 CET (noon)". First grants €5,000 to €50,000                                                                                                                                                                                                                                 | <https://nlnet.nl/propose/>, <https://nlnet.nl/news/2026/20260903-call.html>                                   |
| From now on, deadlines fall on the third day of every odd month. By that pattern the next one after 2026-11-03 is 2027-01-03, but the page does not state that date                                                                                                                                                                             | <https://nlnet.nl/news/2026/20260803-phaseshift.html>                                                          |
| Restack: "operational internet commons across the technology stack", funded by Horizon Europe grant 101299072. Eligible activities include usability and inclusive design and security audits. Its practical help includes "accessibility scans"                                                                                                | <https://nlnet.nl/restack/>, <https://nlnet.nl/restack/eligibility/>                                           |
| CodeSupply: software metadata and supply-chain data sets, funded by Horizon Europe grant 101298846. Not a fit for an accessibility audit                                                                                                                                                                                                        | <https://nlnet.nl/codesupply/>                                                                                 |
| European dimension: normally at least 60% of the funds go to people from Horizon Europe eligible countries. The United Kingdom is on that list                                                                                                                                                                                                  | <https://nlnet.nl/OIS/european-dimension/>                                                                     |
| NGI Zero Review "ended on July 31, 2026"; "Support services are still available to NLnet grantees". The security audit entry says "Capacity for this service has been reached"                                                                                                                                                                  | <https://nlnet.nl/NGI0/review/>                                                                                |
| The support services page still lists Accessibility from HAN University of Applied Sciences ("WCAG audit of project results"), with no withdrawal notice, "available upon request and with limited supplies (first come, first serve!)"                                                                                                         | <https://nlnet.nl/NGI0/services/>                                                                              |
| GenAI policy 2.0 (2026-10-20): no generative AI when writing proposals or answering during evaluation, except as assistive technology; read-only use during funded work; AI costs not reimbursable; past and present GenAI use must be disclosed. The 2026-09-03 call adds that work "(mostly) generated by LLMs" is "not eligible for a grant" | <https://nlnet.nl/foundation/policies/generativeAI/2.0/>, <https://nlnet.nl/news/2026/20261020-AI-policy.html> |

**Not verified:**

- The 2025 post saying accessibility audits were withdrawn. NLnet's 2025 and
  2026 news indexes have no such item. A web search summary mentioned an NGI
  Zero social-media post saying security and accessibility audits are "no
  longer available within the NGI Zero Review program". The post itself could
  not be fetched, so it is unconfirmed.
- Whether a non-grantee can get the HAN WCAG audit. The pages offer it only
  to grantees.
- Whether an external auditor's fee counts as a cost under Restack. The
  eligibility page lists activity types, not subcontracting rules.
- Where the maintainer is resident, which decides the European dimension.

## What this means for the application

- **Do not apply to the Commons Fund.** It no longer exists.
- **Restack is the only plausible NLnet route, and it is a weak fit.** It
  funds the internet stack: infrastructure, alternatives to closed services,
  and end-user clients. A headless UI component library is not obviously in
  that scope. An application would have to argue that accessible, reusable
  UI components serve the end-user applications Restack funds. The maintainer
  should decide whether that case is honest before writing it.
- **An audit-only proposal is unlikely to fit as written.** Restack lists
  "usability/inclusive design" and security audits as activities. It offers
  accessibility scans as support, not as fundable work. A better framing is
  development with an audit attached: human-written fixes for the Tier 1
  core, with HAN's WCAG audit requested through the support services if they
  still have capacity.
- **The AI-use disclosure decides eligibility, not just presentation.** Under
  policy 2.0, the funded work itself cannot be AI-generated. Before writing
  anything, the maintainer should decide whether he can do the funded work
  under a read-only AI rule.

## Draft content (planning notes for the maintainer to rewrite)

### Abstract (points to cover)

- Lily Design System is a free, open-source headless design system: 571
  catalog components implemented across seven frameworks, under a permissive
  licence menu ([LICENSE.md](../../LICENSE.md)).
- It targets WCAG 2.2 AAA and the WAI-ARIA Authoring Practices, and has never
  been independently audited ([accessibility statement](../accessibility-statement.md)).
- The work requested: an independent audit of the interactive core, fixes for
  what it finds, and publication of the full report, so that public-sector and
  health-service teams can see what is actually true.
- The audit scope is already prepared in
  [audit-readiness](../audit-readiness.md), so no discovery phase is needed.

### Requested amount and breakdown

NLnet's first-grant range is €5,000 to €50,000. **No auditor has quoted, and
audit-readiness deliberately publishes no figure.** The figures below are
placeholders for the maintainer to replace with real quotes. They are not
estimates from evidence.

| Tier                                 | Scope (from audit-readiness)                                                                                                                                  | Audit cost | Fix and re-test effort (human-written) |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------- |
| 1: interactive core (~40 components) | form family, the helper packages (theme, locale, text-size, share, date-time picker), dialogs, tabs, menus, accordion, pagination, sortable tables, skip-link | _quote_    | _hours × rate_                         |
| 2: composed flows                    | the 12 composed demo routes; theme, locale and text-size switching                                                                                            | _quote_    | _hours × rate_                         |
| 3: long-tail sample                  | an auditor-chosen sample, including national-identifier inputs                                                                                                | _quote_    | _hours × rate_                         |
| Publication                          | the verbatim report, a findings-to-WCAG mapping, and an updated accessibility statement                                                                       | none       | _hours × rate_                         |

Pick a floor and a ceiling. The floor is Tier 1 alone, plus fixes and
publication. The ceiling is all three tiers plus a re-test, within €50,000. If
Tier 1 alone costs more than the ceiling, apply for Tier 1 only. Audit-readiness
says the tiers exist so that "a partial budget still buys something coherent".

### Milestones (for NLnet's milestone-based payment; check against the form)

1. Auditor contracted; scope fixed to Tier 1 (and Tiers 2 and 3 if funded).
2. Audit report delivered; findings logged as public issues mapped to WCAG
   2.2 criteria and APG patterns.
3. Tier 1 fixes merged across the seven frameworks; each fix written by a
   person, per the GenAI policy.
4. Re-test of fixed findings, if budgeted; report and updated accessibility
   statement published.
5. (If funded) Tiers 2 and 3: the same sequence.

### Relevant prior work

- [docs/audit-readiness.md](../audit-readiness.md): scope, environments, and
  what the auditor gets on day one.
- [docs/accessibility-statement.md](../accessibility-statement.md): what is
  verified, by what, and what is not.
- Per-component contracts in `components/{slug}/AGENTS.md` (element, ARIA,
  keyboard, props), so findings can tell "spec wrong" from "implementation
  wrong".
- Machine gates: axe-core, Playwright, per-framework suites, `bin/check-theme`
  contrast checks ([MAINTAINERS.md](../../MAINTAINERS.md) and
  [AI_STATEMENT.md](../../AI_STATEMENT.md) §7).
- [docs/screen-reader-matrix.md](../screen-reader-matrix.md): the
  assistive-technology gap, stated as a gap.
- [AI_STATEMENT.md](../../AI_STATEMENT.md): the disclosure the GenAI policy
  requires already exists.
- [MAINTAINERS.md](../../MAINTAINERS.md): a bus factor of one, stated
  plainly.

## Before submitting (maintainer only)

- [ ] Decide whether Restack's scope honestly covers this work. If it does
      not, do not apply to NLnet in this round.
- [ ] Confirm residency against the European dimension rule.
- [ ] Ask NLnet whether the HAN WCAG audit is still available to new
      grantees.
- [ ] Get at least one auditor quote for Tier 1.
- [ ] Write the proposal yourself, without generative AI (policy 2.0).
- [ ] Record the submission date and outcome in
      [spec/free-open-source-funding](../../spec/free-open-source-funding/index.md).

---

Lily™ and Lily Design System™ are trademarks.
