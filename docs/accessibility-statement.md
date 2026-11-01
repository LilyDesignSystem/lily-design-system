# Accessibility statement — Lily Design System™

_Last reviewed 2026-08-28. This statement changes in the same commit as
the practice it describes._

Lily **targets WCAG 2.2 AAA** and follows the WAI-ARIA Authoring
Practices Guide 1.2. That word — _targets_ — is deliberate and this
document exists to make it precise: what is verified, by what, what is
not verified by anything, and what we intend to do about the gap. The
project's standing rule is that no artifact may claim WCAG
"compliance", because no audit supports it.

## What is verified, and by what

| Claim                                                                                    | Verified by                                                                                                                                                                                                                                                                                                                                           | Standing                                             |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Every component renders its canonical semantic element, ARIA attributes, and class hooks | Per-framework unit suites asserting rendered DOM (15,000+ cases across seven frameworks; counts in [spec §11.4](../spec/index.md))                                                                                                                                                                                                                    | Continuous (CI)                                      |
| Every component demo page is axe-clean in the SvelteKit app                              | The full-catalog sweep (`e2e/axe-catalog.spec.ts`), last run 2026-10-29 over 582 pages in Chromium, Firefox and WebKit: one failure in all three (`switch-button`, a demo-text contrast defect since fixed in the demo, not re-run); plus per-app axe baselines on home, catalog, and composed routes — rule sets WCAG 2.0 A+AA, 2.1 A+AA, **2.2 AA** | Baselined 2026-08-27; per-app suites in the e2e runs |
| Keyboard contracts for interactive components                                            | Documented per component in `components/{slug}/AGENTS.md`; exercised by unit suites and, for the helpers, by real-browser Playwright specs                                                                                                                                                                                                            | Continuous                                           |
| Touch targets meet WCAG 2.2 target-size (2.5.8) on themed pages                          | A shared floor in all 63 themes, checked by the axe 2.2 rule set in every sweep                                                                                                                                                                                                                                                                       | Continuous                                           |
| No hardcoded user-facing strings; `lang`/`dir` application                               | The i18n rules in [AGENTS/internationalization.md](../AGENTS/internationalization.md); locale-picker e2e asserts `lang` and the RTL flip in the seven original example apps                                                                                                                                                                           | Continuous                                           |
| Skip-link, landmarks, no horizontal overflow at four viewports                           | Responsive sweeps per example app                                                                                                                                                                                                                                                                                                                     | Continuous                                           |

## What is not verified by anything

Stated because a statement without this section is marketing:

- **No conformance audit has ever been performed.** No WCAG audit by a
  third party and no certification; the only ACR is self-assessed (below). Automated tooling covers a minority of
  WCAG success criteria.
- **AAA-specific criteria are not systematically tested.** The axe rule
  sets run A/AA. AAA criteria (enhanced contrast 1.4.6, no-timing,
  context-sensitive help, and others) are design intents, not verified
  properties. There is no dedicated high-contrast theme yet
  ([spec/theme](../spec/theme/index.md) records this gap).
- **Screen-reader behaviour is largely untested.** Unit suites assert
  ARIA attributes, not what VoiceOver, NVDA, or JAWS actually announce;
  the [screen-reader matrix](screen-reader-matrix.md) has 0 of its 120
  cells filled (2026-10-30), so [Lily Core](core.md) has no members.
  This project has shipped green suites over real defects more than
  once — a picker frozen at `aria-expanded="true"`, radio buttons that
  were text inputs to AT — and each is written up in
  [CHANGELOG.md](../CHANGELOG.md) precisely because the suites could
  not see them.
- **Cognitive accessibility, zoom/reflow beyond the responsive sweep
  (320 px and a 400%-zoom emulation since 2026-10-28),
  and Windows high-contrast mode** have had no dedicated testing. The
  themes carry a `forced-colors` block (2026-10-29), not yet exercised by a
  forced-colours Playwright run (tasks.md P12-T13).

## Known gaps and intentions

- An **independent accessibility audit** is the first named use of any
  project funding ([CONTRIBUTING.md](../CONTRIBUTING.md)); the scope an
  auditor needs is prepared in
  [docs/audit-readiness.md](audit-readiness.md).
- **Screen-reader reports are the contribution this project wants
  most** — a report of the form "component X announces Y, which is
  wrong because Z" is directly actionable
  ([CONTRIBUTING.md](../CONTRIBUTING.md) § Contribute time).
- Findings, including ones that survive shipping, are recorded in
  [CHANGELOG.md](../CHANGELOG.md) rather than fixed quietly; spec
  [§11.5a](../spec/index.md) holds the full-catalog sweep's findings.
- A **self-assessed** [accessibility conformance report](accessibility-conformance-report.md)
  (VPAT 2.5, WCAG 2.2 edition) covers the [Lily Core](core.md)
  candidates. It is not an independent audit, and it says so.

## Reporting an accessibility problem

An accessibility defect report is welcome exactly like any other
defect, with no extra ceremony: open an issue at
<https://github.com/LilyDesignSystem/lily-design-system/> or email
<joel@joelparkerhenderson.com>. If it names a WCAG criterion or an APG
pattern, all the better — but "I couldn't operate X with the keyboard"
is a complete report.

---

Lily™ and Lily Design System™ are trademarks.
