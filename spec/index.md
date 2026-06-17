# Lily Design System — Specification Topics

> Modular, topic-by-topic specification help for the Lily Design System.
> Each topic is a standalone deep-dive grounded in the canonical
> [spec.md](../spec.md) and the `AGENTS/*.md` reference docs. This page is the
> hub that links them all.

The single source of truth remains the living [spec.md](../spec.md); these
topic docs reorganise and expand its contents into focused, cross-linked
references for humans and AI coding agents.

## Topics

| Topic | What it covers |
| ----- | -------------- |
| [overview](overview/index.md) | Vision, scope, the headless vs. example layers, key facts. |
| [architecture](architecture/index.md) | Monorepo layout, the 14 subprojects, helper catalogs, the git-subtree model, required files. |
| [headless](headless/index.md) | Headless design rules: semantic markup, class hooks, rest-props, behaviour boundaries, zero CSS. |
| [accessibility](accessibility/index.md) | WCAG 2.2 AAA target, WAI-ARIA APG patterns, ARIA reference table, axe-core baselines. |
| [internationalization](internationalization/index.md) | No hardcoded strings, stable text-prop names, locale-aware props, RTL/bidi. |
| [theme](theme/index.md) | Token shape, `--theme-*` custom properties, `data-theme` variants, the headless forbidden-list. |
| [components](components/index.md) | The 492-component catalog, suffix→element mapping, name patterns, composition, per-component docs. |
| [examples](examples/index.md) | Example apps, the three required routes, NHS reference styling, demo render mechanisms. |
| [tooling](tooling/index.md) | The `bin/` scripts, the rsync sync model, `bin/test` verification, subtree push. |
| [testing](testing/index.md) | Per-framework test suites, Storybook coverage, Playwright e2e, axe, responsive sweep. |
| [frameworks](frameworks/index.md) | The seven framework pairs, per-framework file shapes and idioms, the copy-pattern. |
| [helpers](helpers/index.md) | The `*-helpers` catalogs — theme-select and locale-select — and their per-framework manifests. |
| [national-identifiers](national-identifiers/index.md) | The 80 national personal identifier components, normalization, validation algorithms. |
| [citations](citations/index.md) | Design systems Lily learns from, the NHS UK reference, Reuters Graphics influence. |

## How these docs are organised

Every topic doc follows the same shape:

- **Summary** — one or two sentences.
- **Scope** — what the topic covers and what it explicitly excludes.
- **Principles and rules** — the binding rules, grounded in canonical sources.
- **Detail sections** — tables, mappings, patterns, and short examples.
- **Acceptance criteria** — a checklist of what "correct/done" means.
- **Related topics** — cross-links to sibling topics.
- **Sources** — repo-relative links to the canonical files behind the topic.

## Canonical sources

- [spec.md](../spec.md) — the living specification (single source of truth).
- [AGENTS.md](../AGENTS.md) and [AGENTS/](../AGENTS/) — modular reference docs.
- [components.tsv](../components.tsv) — the canonical 492-component catalog.
- [css-style-sheet-template.css](../css-style-sheet-template.css) — class-hook stylesheet template.
