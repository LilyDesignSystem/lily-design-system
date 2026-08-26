<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/NEWS.md -->

# News

Announcements, release highlights, project status, and press contacts for Lily
Design System™.

The complete engineering record is in [CHANGELOG.md](CHANGELOG.md); this file is
the summary a reader, a reporter, or an evaluator wants first.

- **Website:** <https://lilydesignsystem.github.io/>
- **Source:** <https://github.com/LilyDesignSystem/lily-design-system/>
- **Contact:** <joel@joelparkerhenderson.com>

## Status at a glance

_Updated 2026-08-26._

| | |
| --- | --- |
| Version | 0.6.0 (pre-1.0; minor versions may break) |
| Started | 2025-08-09 |
| Catalog | 491 components |
| Frameworks | 7 — HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks |
| Layers | 7 headless libraries, 7 example applications, 7 helper catalogs (35 packages) |
| Themes | 45 reference stylesheets |
| Published | 3 headless packages and 30 helper packages on npm; NuGet pending |
| License | MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only, or BSD-3-Clause, at your option |
| Maintainers | 1 |

## Recent news

### 2026-08-23 — Headless packages get a real entry point (0.3.0)

The three published headless packages were broken on npm and nothing had caught
it. Each declared `"main": "index.js"` and no such file had ever been built, so
every `import … from "lily-design-system-<framework>-headless"` failed at
resolution — 0.2.0 is unusable on the registry for that reason. Nothing in CI ever
imported a package the way a consumer does; the tests import component files by
relative path.

Each package now generates a barrel over all 491 components and builds a real
`dist/`, verified by installing the packed tarball into a scratch project. The
packages shrank by roughly 80% in the process. **If you installed 0.2.0, upgrade.**

### 2026-07-31 — Two picker defects, found and fixed across all seven catalogs

A report that a picker might stay open led to an audit that found the close path
was fine and something else was wrong: a re-entrant apply step re-fired the
consumer's change callback on every framework re-evaluation, and in Svelte that
looped until the component stopped updating its DOM entirely, freezing the listbox
mid-open with a stale `aria-expanded="true"`. Applying a preference is now a no-op
when the value has not changed.

The same audit found that six of seven catalogs closed the listbox on a pointer
selection correctly, with nothing asserting it — the written contract only
promised the close for keyboard selection. The contract now states it and every
catalog tests it.

Both are written up rather than quietly fixed, because they bound what automated
testing proves: neither was visible to jsdom or bUnit with the suites green.

### 2026-07-29 — Accessibility hardening across all 35 helper packages

Two sweeps, canonical-Svelte-first then ported to the six sibling catalogs.
Tabbing out of an open picker no longer restarts keyboard focus at the top of the
page; APG single-character typeahead cycles; PageUp/PageDown work; vetoed calendar
days became `aria-disabled` rather than `disabled`, so they stay focusable and
announced; closing the date-picker dialog returns focus to whatever opened it; and
the locale picker now defaults to **endonym** labels — "Cymraeg", not "Welsh" —
claiming `lang` only where it is true.

### 2026-07-21 — Helpers renamed to `*-picker`

Every helper package in all seven catalogs was renamed, in full depth: directories,
package identifiers, exported symbols, CSS class hooks, data attributes, and
element tags. All tests passed with unchanged counts, because it was a rename and
not a behaviour change. Every package reset to 0.1.0; prior history is preserved
under a provenance heading in each `CHANGELOG.md`.

### 2026-07-03 — Reference themes, the helpers layer, and spec-driven docs (0.5.0, 0.6.0)

45 theme stylesheets landed, covering NHS England, Scotland and Wales in patient
and practitioner variants, plus GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla
Protocol, and general-purpose themes. Spec-driven development moved from single
`spec.md` files to `spec/` directories across the repository, all 21 subprojects,
and all component directories. `bin/test` now fails the build instead of reporting
sadly, and `bin/check-links` fixed 89 broken markdown links.

### 2026-05-30 — The seventh framework: Angular (0.3.0)

Angular 20 headless (signal-based, OnPush, standalone, zero-CSS) and an Angular +
Analog.js example app. The headless library is fully verified: 974 vitest cases
across 490 spec files, a clean `ng-packagr` build, and 490 Storybook stories. The
example app's static SSG output remains blocked on an upstream Analog issue.

### 2026-05-24 — 80 national personal identifier components (0.2.0)

40 identifier types across 30+ countries, each with an `-input` and a `-view`
component, with normalization and validation algorithms documented per country.

## What is coming

Not commitments — the project has one unpaid maintainer and no roadmap dates.

- Publishing the remaining four headless packages (HTML, Angular, Nunjucks to npm;
  Blazor to NuGet).
- Wiring the 45 reference themes into the example applications as switchable
  alternatives to the default NHS layer.
- Resolving the Angular SSG blocker upstream.
- More composed-page demonstrations beyond the three required routes.
- Contributor onboarding documentation.

## For reporters and writers

Lily is a free open-source project, not a company. There is no PR firm, no
embargo process, and no marketing team. Ask a direct question and you will get a
direct answer, including when the answer is unflattering.

**Press contact:** Joel Parker Henderson, <joel@joelparkerhenderson.com>

### Boilerplate

> Lily Design System™ is a free, open-source, headless design system. It defines a
> canonical catalog of 491 components and implements that same catalog across seven
> frameworks — HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks — as
> unstyled, accessible components that ship semantic HTML, ARIA, focus management,
> and keyboard behaviour with no CSS and no framework dependency. It also ships 45
> reference theme stylesheets, seven fully styled example applications, and 35
> helper packages. Lily targets WCAG 2.2 AAA, follows the WAI-ARIA Authoring
> Practices, and requires every user-facing string to be supplied by the consumer.
> It is maintained by Joel Parker Henderson and is available under a choice of MIT,
> Apache-2.0, GPL-2.0-only, GPL-3.0-only, or BSD-3-Clause.

### Facts worth checking before you print them

Please do check. Several are counterintuitive and one is a common error.

- **"Targets WCAG 2.2 AAA" is not "is WCAG 2.2 AAA compliant."** No audit has been
  performed and no VPAT exists. Automated checks run AA rule sets. The distinction
  matters and the project will not endorse the stronger phrasing.
- Lily is **not affiliated with or endorsed by** NHS, GOV.UK, USWDS, Adobe, or
  Mozilla. The themes take visual reference from published design systems; they
  are independent implementations against Lily's own class names.
- The project has **one maintainer** and began in **August 2025**.
- **Four of seven frameworks are not yet on a package registry** — see
  [INSTALL.md](INSTALL.md).
- AI tooling is used to build Lily, disclosed in full in
  [AI_STATEMENT.md](AI_STATEMENT.md). Lily itself **ships no AI** and makes no
  network calls.

### Story angles that are actually interesting

More useful than a release announcement, and all grounded in work already done and
documented:

- **What automated accessibility testing cannot catch.** Two real defects that
  survived thousands of green tests, both written up in
  [CHANGELOG.md](CHANGELOG.md).
- **Cross-framework parity.** What breaks when the same catalog must hold an
  identical markup contract in seven frameworks, and where the idioms genuinely
  diverge.
- **Endonym locale labels.** Why a language picker that says "Welsh" instead of
  "Cymraeg" is a defect, and why claiming `lang` on it is a worse one.
- **Optical glyph matching.** Why four icon glyphs at one `font-size` look wrong,
  and the per-glyph scale factors in the 45 themes that fix it.
- **National identifier components.** 80 components, 30+ countries, and what
  validating identifier formats without storing identifiers looks like.

### Assets

Screenshots, logos, and the trademark usage convention: ask by email. The
[`assets/`](https://github.com/LilyDesignSystem/lily-design-system/tree/main/assets) directory holds what currently exists.

## Citing Lily

Machine-readable metadata is in [CITATION.cff](CITATION.cff), including the
author's ORCID iD.

## Following along

There is no newsletter or social account yet. Watch the repository on
[GitHub](https://github.com/LilyDesignSystem/lily-design-system/), or the mirrors
on GitLab and Codeberg. The outreach plan that would change this is written down
in [help/outreach/index.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/help/outreach/index.md).

---

Lily™ and Lily Design System™ are trademarks.
