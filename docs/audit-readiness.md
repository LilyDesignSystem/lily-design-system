# External audit readiness — Lily Design System™

_Prepared 2026-08-28 (plan P4-T5) so that funding, when it arrives,
converts into an audit without a discovery phase._

## What an auditor would be asked to audit

**Primary scope — the component contract, not an app.** Lily is a
headless component library; the audit target is the rendered semantics,
ARIA, keyboard operation, and themed presentation of its components,
using the SvelteKit example app as the harness (it renders every
component at `/components/{slug}` with the NHS England patients theme
by default and 45 switchable themes).

Suggested tiers, so a partial budget still buys something coherent:

1. **Tier 1 — the interactive core (~40 components):** the form family
   (form, field, label, inputs, select, fieldset, error-summary), the
   five helper packages (theme/locale/text-size/share/date-time
   picker — hand-rolled APG listbox/disclosure/dialog patterns, the
   highest-risk surface in the project), dialogs, tabs, menus,
   accordion, pagination, tables with sorting, skip-link.
2. **Tier 2 — the composed flows:** the 12 composed demo routes and the
   theme/locale/text-size switching experience itself.
3. **Tier 3 — sampling the long tail:** auditor-chosen sample of the
   remaining catalog, including the national-identifier inputs.

## Environments

| Surface | How to run |
| --- | --- |
| SvelteKit harness | `cd lily-design-system-svelte-sveltekit-examples && pnpm install && pnpm build && pnpm preview` |
| Any other framework | six sibling apps, same routes; [INSTALL.md](../INSTALL.md) |
| Assistive tech of record | auditor's choice; the project's own gap is precisely that none has been systematically used |

## What the auditor gets on day one

- Per-component canonical contracts: `components/{slug}/AGENTS.md`
  (element, ARIA, keyboard, props) — the spec the implementation is
  accountable to, so findings can distinguish "spec wrong" from
  "implementation wrong".
- The current verified baseline and its edges:
  [docs/accessibility-statement.md](accessibility-statement.md).
- The known-issues register: spec §11.5a and §11.8, plus
  [CHANGELOG.md](../CHANGELOG.md)'s defect write-ups (the project
  records what its tests could not see).
- A maintainer who answers questions and does not argue with findings:
  the standing rule is that reports get attributed, answered, and never
  silently absorbed.

## What the project asks of the audit

- Findings mapped to WCAG 2.2 criteria and, where relevant, APG
  patterns, at whatever conformance level the evidence supports.
- Permission to publish the report verbatim (redactions negotiable) —
  an audit the community cannot read buys reputation, not accessibility.
- A re-test window for fixed findings if the budget allows.

## Budget realism

No figure is published here; audits are quoted on scope. The funding
channel and the commitment that an audit is the first named purchase
live in [CONTRIBUTING.md](../CONTRIBUTING.md).

---

Lily™ and Lily Design System™ are trademarks.
