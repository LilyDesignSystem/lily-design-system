# Lily Design System™ — Nunjucks Skill

@AGENTS/lily.md
@AGENTS/theme.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/helpers.md
@AGENTS/examples.md
@AGENTS/citations.md
@AGENTS/nhs-uk-design-system-references.md
@AGENTS/nunjucks.md

## Metadata

- **Package**: lily-design-system-nunjucks-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill that ties together the three real Nunjucks subprojects in
this monorepo — [`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless/)
(the 491-component headless macro library),
[`lily-design-system-nunjucks-helpers`](../lily-design-system-nunjucks-helpers/)
(the six `*-picker` macro-plus-`client.js` packages), and
[`lily-design-system-nunjucks-eleventy-examples`](../lily-design-system-nunjucks-eleventy-examples/)
(the fully styled Eleventy 3 reference app) — and helps an agent decide
which one a task needs. It is an **umbrella skill**: it sits one level
above [`lily-design-system-nunjucks-headless-skill`](../lily-design-system-nunjucks-headless-skill/)
and [`lily-design-system-nunjucks-helpers-skill`](../lily-design-system-nunjucks-helpers-skill/),
routing to them for the headless macro-call idiom and the picker helper
contracts rather than restating either. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads — including `@AGENTS/nunjucks.md`, pulled in specifically because
this subproject, though an umbrella, is scoped to one framework rather
than all seven.

## What this subproject is, and isn't

- **Is**: the Nunjucks umbrella/entry-point skill — a map of the three
  real Nunjucks subprojects, guidance on which one a task needs, real
  coverage of the Eleventy example app (the one of the three that neither
  deeper sibling skill documents), and pointers into the two deeper
  sibling skills for the headless and helpers contracts.
- **Isn't**: the Nunjucks headless library, the helpers catalog, or the
  Eleventy example app themselves — it ships no macros, no client.js
  modules, no example pages. Isn't the general, framework-agnostic
  [`lily-design-system-skill`](../lily-design-system-skill/), which covers
  Lily concepts spanning all seven frameworks. Isn't a duplicate of
  [`lily-design-system-nunjucks-headless-skill`](../lily-design-system-nunjucks-headless-skill/)
  or
  [`lily-design-system-nunjucks-helpers-skill`](../lily-design-system-nunjucks-helpers-skill/) —
  it defers to both for their respective deep contracts.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
