# Overview

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily is a free, open-source, framework-plural design system whose headless layer ships semantic HTML, ARIA, focus, and keyboard behaviour with zero visual decisions, and whose example layer ships complete, styled reference applications.

## Scope

This topic covers what Lily is, its vision, the headless-vs-example layer split, what is in and out of scope, the key facts (catalog size, framework count, accessibility target), and project tracking metadata (version, license, contact).

It does not cover the monorepo directory layout or git-subtree model (see [architecture](../architecture/index.md)), nor the binding principle contracts for headless, accessibility, internationalization, or theme (see those topics).

## Principles and rules

- **Accessible by default.** WCAG 2.2 AAA is the target across every component, demo, and framework; WAI-ARIA Authoring Practices 1.2 is the reference for keyboard, roles, and states.
- **Composable.** Small components snap together into navigation, table, form, and layout patterns.
- **Internationalisable.** Every user-facing string is supplied by the consumer; components hardcode no copy.
- **Framework-plural.** The same canonical catalog is implemented across HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks.
- **CSS-strategy-agnostic.** Works with semantic CSS, utility CSS (Tailwind), or no CSS at all.
- **Forkable.** Any team can adopt, fork, theme, or extend Lily; the headless layer makes no visual decisions and the example layer is a reference, not a dependency.

## The two layers

Lily is organised as two complementary layers — each component exists once in the canonical catalog and is realised in both.

| Layer | Ships | Owns | Does not own |
| --- | --- | --- | --- |
| **Headless** | Semantic markup, ARIA, focus management, keyboard behaviour, class hooks, `data-*` state | Accessibility and structure | Colour, spacing, typography, breakpoints, fonts, icons, stylesheets |
| **Example** | Complete styled reference apps with a full stylesheet, real text, working app shells | Every visual decision and every string | Nothing imposed on consumers — examples are demonstrations |

The headless layer is the contract; the example layer is the proof. Adopters can see the system working end-to-end before committing.

## Scope: in and out

**In scope**

- A canonical catalog of **490 components** (`components.tsv`).
- **Seven headless component libraries**: HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks.
- **Seven example applications**: HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Angular Analog, Blazor Web, Nunjucks Eleventy.
- A CSS style-sheet template (`css-style-sheet-template.css`) declaring every component class hook.
- Per-component documentation under `components/{slug}/`.
- Tooling for listing, scaffolding, syncing, and testing across subprojects (`bin/`).
- Modular project documentation in `AGENTS/*.md`.

**Out of scope**

- Bundled stylesheets in the headless layer.
- A CSS framework dependency (Tailwind / DaisyUI / Bootstrap).
- Data fetching, network state, persistence, or routing.
- Locale-specific formatting (consumer wires `Intl.*` or a library).
- Animation choreography, transitions, motion design.
- Bundled fonts, icon sets, or imagery.
- Hardcoded user-facing strings.

## Key facts

| Fact | Value |
| --- | --- |
| Canonical components | 490 |
| Headless libraries | 7 (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks) |
| Example applications | 7 (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Angular Analog, Blazor Web, Nunjucks Eleventy) |
| Accessibility target | WCAG 2.2 AAA; WAI-ARIA APG 1.2 |
| Default visual reference (examples) | NHS UK design system applied to Lily class names |
| Canonical catalog file | `components.tsv` (tab-separated: slug, PascalCase name, description) |

## Tracking

| Field | Value |
| --- | --- |
| Package | lily |
| Version | 0.4.0 |
| Created | 2025-08-09 |
| Updated | 2026-05-30 |
| License | MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or contact for other terms) |
| Contact | Joel Parker Henderson <joel@joelparkerhenderson.com> |

## Acceptance criteria

- [ ] Canonical component list defines exactly 490 components in `components.tsv`.
- [ ] All 7 headless subprojects exist and implement the full catalog.
- [ ] All 7 example subprojects exist and implement the full catalog.
- [ ] The headless layer bundles no stylesheets, fonts, images, or icons.
- [ ] No component embeds a hardcoded user-facing string.
- [ ] WCAG 2.2 AAA is the stated target across every component, demo, and framework.
- [ ] Tracking metadata (version, license, contact) is current and matches `spec/index.md` §14.

## Related topics

- [architecture](../architecture/index.md) — monorepo layout, 14 subprojects, git-subtree fan-out
- [headless](../headless/index.md) — the unstyled, accessible component contract
- [examples](../examples/index.md) — styled reference apps and required routes
- [components](../components/index.md) — the canonical catalog and naming conventions
- [accessibility](../accessibility/index.md) — WCAG 2.2 AAA and WAI-ARIA APG rules
- [frameworks](../frameworks/index.md) — per-framework implementation notes

## Sources

- [spec/index.md](../index.md) — §1 Vision, §2 Scope, §14 Tracking
- [AGENTS.md](../../AGENTS.md)
- [AGENTS/lily.md](../../AGENTS/lily.md)
