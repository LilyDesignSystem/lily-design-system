# Lily Design System™ — HTML Skill

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

## Metadata

- **Package**: lily-design-system-html-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill that ties together the three real plain-HTML subprojects in
this monorepo — [`lily-design-system-html-headless`](../lily-design-system-html-headless/)
(the full-catalog, 491/491 headless component library and reference
implementation), [`lily-design-system-html-helpers`](../lily-design-system-html-helpers/)
(the six `*-picker` custom elements), and
[`lily-design-system-html-css-js-examples`](../lily-design-system-html-css-js-examples/)
(the styled, NHS-UK-themed reference application) — and helps an agent
decide which one a given request actually needs. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, so an agent routing between the three HTML subprojects is grounded in
the same rules each of them is held to.

This subproject sits one level above
[`lily-design-system-html-headless-skill`](../lily-design-system-html-headless-skill/)
and [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/):
those two carry the deep, per-subproject contract; this one is the map that
routes a request to the right one of the three, and is the only skill that
gives the example application real coverage.

## What this subproject is, and isn't

- **Is**: the plain-HTML umbrella and entry-point skill — a map of the
  three real HTML subprojects, a decision guide for which one to reach for,
  real coverage of the example app (routes, NHS UK visual reference,
  running it, helper vendoring), and pointers into the two sibling skills
  and into the general Lily concepts skill rather than a restatement of any
  of them.
- **Isn't**: the HTML headless library, the HTML helpers catalog, or the
  HTML example application themselves — it ships no components, no custom
  elements, no example pages of its own. Isn't the general Lily concepts
  skill (that's [`lily-design-system-skill`](../lily-design-system-skill/)).
  Isn't a duplicate of
  [`lily-design-system-html-headless-skill`](../lily-design-system-html-headless-skill/)
  or [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/) —
  it points at both rather than restating their contracts. Isn't the skill
  for the separate Web Components catalogs (native custom elements, a
  456/491 headless slice, its own `lily-design-system-web-components-skill`
  and its own `-headless-skill` / `-helpers-skill` siblings).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
