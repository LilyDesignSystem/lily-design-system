# Assurance pack

For the person who has to decide whether a team may use Lily Design System™ in a service, and who will be asked to show
their working. This page collects the evidence that exists, says what does not exist yet, and lists the questions an
assurance team usually asks, with answers that point at the source.

It is not a certificate. Nobody has audited Lily, and nothing here is a claim of compliance with any scheme. Where a
statement is about the law or a standard of a particular country, check it with the people in your organisation who own
that standard.

## What Lily is, for assurance purposes

- **A component library and a set of themes**, not a service. It stores and sends nothing about your users on its own.
- **Not a medical device, and not a clinical system.** It has no clinical logic: it does not compute a score, a dose or a
  reference range ([healthcare guide](../patterns/healthcare/index.md#what-lily-will-not-do)). A service that shows clinical
  information with it carries its own clinical risk, and its own responsibility to manage it.
- **Built into your application.** What your users receive is your build of Lily plus your code, so your own build,
  hosting and policies decide most of the risk.

## Evidence available now

| Question                                | Evidence                                                                                                                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How do I report a vulnerability?        | [SECURITY.md](../../SECURITY.md): private reporting, response times, safe harbour                                                                                                 |
| What is the threat model?               | [SECURITY.md § Threat model](../../SECURITY.md): assets, trusted and untrusted input, attackers considered                                                                        |
| What can I check for myself?            | [SECURITY.md § Structural properties](../../SECURITY.md): no network calls, no telemetry, no raw HTML rendering, `sideEffects: false`                                             |
| Does it run under a strict CSP?         | [Content Security Policy](../content-security-policy.md): a starting policy, and the ten components that write a `style` attribute                                                |
| Are dependencies checked?               | A weekly audit of every lockfile (`bin/security-audit`, `.github/workflows/security-audit.yml`) and a dependency-review workflow                                                  |
| Are dependencies kept up to date?       | Grouped weekly update pull requests from `.github/dependabot.yml`                                                                                                                 |
| What licence is it under?               | [LICENSE.md](../../LICENSE.md): a choice of several, including MIT and Apache 2.0                                                                                                 |
| How well is it tested?                  | [Test coverage](../coverage.md), [benchmarks](../../BENCHMARKS.md), the mutation tests (`bin/mutation-test`), and the per-framework suites                                        |
| How accessible is it?                   | [Accessibility statement](../accessibility-statement.md), the [self-assessed report](../accessibility-conformance-report.md), [Core](../core.md)                                  |
| Which themes pass contrast?             | [Theme contrast table](../theme-contrast.md), checked on every build for the light and dark themes                                                                                |
| What does it send to a network?         | Nothing: the headless layer has no data fetching. The website loads nothing from third parties, and sets one preference cookie (the theme) only after a visitor chooses a theme.  |
| What does it keep in the browser?       | Only what a picker you use stores: the choice in `localStorage` and, for the theme picker, a first-party cookie. Each has a name you can change; an empty string switches it off. |
| Who maintains it, and how are releases? | [MAINTAINERS.md](../../MAINTAINERS.md) and [releasing](../releasing.md)                                                                                                           |

## Not available yet

Say so in your own assurance record rather than assume.

| Gap                                             | What it means for you                                                                                 | Task                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- |
| No independent accessibility audit              | The statement is self-assessed. Commission your own audit of your service.                            | [P25-T13](../../tasks.md) |
| Screen-reader results are mostly not recorded   | Test with the assistive technology your users use.                                                    | [P25-T12](../../tasks.md) |
| No shipped software bill of materials           | Generate one from your own build (below).                                                             | P41-T5b                   |
| Release provenance is not uniform across forges | Read what [SECURITY.md](../../SECURITY.md) states for each registry, and verify packages you install. | P41-T5b                   |
| No penetration test                             | The threat model is a design document, not a test result.                                             |                           |
| A known gap in stored-value checking            | Several pickers apply a stored value as written; the risk needs script on your own origin first.      | [P35-T6](../../tasks.md)  |
| Machine-drafted translations                    | 63 of the 64 label packs are not reviewed by a native speaker. Do not ship one to users unreviewed.   | P41-T1                    |
| One maintainer, no support contract             | Plan for continuity: pin versions, keep a copy, be ready to fork. The licences allow it.              |                           |

## Make your own software bill of materials

Your build is what ships, so the useful bill of materials is yours. For an npm project with its dependencies installed,
`npm sbom --sbom-format cyclonedx` writes a CycloneDX document for the whole tree, Lily packages included; use your
registry's own tooling for NuGet. Keep it with the release it describes.

## Clinical safety support

If your service is health or care software, you probably have a clinical risk management process and a safety officer.
Lily cannot do that work for you, but it can help you with the hazards that come from the interface. Put these in your
hazard log if they apply, then decide the controls.

| Hazard                                           | What Lily does about it                                                                                                                              | What you still must do                               |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| The wrong patient's record is acted on           | A patient banner pattern; identifiers shown, not restricted ([guide](../patterns/healthcare/index.md#wrong-patient-errors-identify-do-not-restrict)) | Test it with your own identifiers and workflows      |
| A value is cut off, so a dose or name is misread | Names are never truncated in the record components; a table scrolls rather than clipping                                                             | Test with your longest real values                   |
| A status is missed because only colour shows it  | Every status is written in words; colour is a second cue                                                                                             | Write the words, and review them clinically          |
| A missing value reads as a normal one            | A missing value is a stated status, never blank or a dash                                                                                            | Decide the wording for each status                   |
| A date is read the other way round               | Dates go through `Intl` in the reader's language; formatting helpers refuse a missing locale                                                         | Check your locales, and the time zone of every date  |
| A critical alert is lost among many              | Interrupt only for what is critical; alerts are never behind a collapsed control                                                                     | Decide what is critical, and tune it with clinicians |
| A translated string is wrong                     | Strings are yours, so you can review them; draft packs are marked unreviewed                                                                         | Have clinical and language review before release     |
| A live display changes while someone is reading  | Updates can be paused; rows do not reorder under focus                                                                                               | Decide how often data refreshes, and say when        |

## Regional profile: UK public-sector health

A profile, not the default: Lily is worldwide, and other regions need their own. These are the expectations a UK
public-sector health team commonly meets. The names are for you to look up and confirm with your assurance team.

- **Accessibility.** Public sector bodies publish an accessibility statement and aim for WCAG 2.2 level AA. Lily targets AAA and
  says what is not verified, so a team can build its own statement on top of the evidence above.
- **Data protection.** Lily collects nothing. Your service's own data protection impact assessment covers your data.
- **Clinical safety.** Health IT suppliers and deploying organisations follow national clinical risk management standards
  (commonly referred to as DCB0129 for the manufacturer and DCB0160 for the deploying organisation). The table above is input
  to your hazard log, not a replacement for it.
- **Technology assessment.** Digital health services are often assessed against a national criteria set (commonly the DTAC).
  Lily's answers on security, interoperability and usability are in the sections above.
- **Interoperability.** Clinical display components map to FHIR elements in the [healthcare guide](../patterns/healthcare/index.md#from-fhir-to-lily).

## Questions to ask us

Open an issue at <https://github.com/LilyDesignSystem/lily-design-system/issues> with the question, the standard it comes
from, and what evidence you need. A question we cannot answer is useful: it goes on this page as a gap.

---

Lily™ and Lily Design System™ are trademarks.
