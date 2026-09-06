# Lily Design System™ — Web Components Skill

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

- **Package**: lily-design-system-web-components-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill that ties together the two real native-Web-Components
subprojects in this monorepo —
[`lily-design-system-web-components-headless`](../lily-design-system-web-components-headless/)
(a partial, growing catalog of native custom elements — 125/491 as of
2026-09-06 — no framework runtime) and
[`lily-design-system-web-components-helpers`](../lily-design-system-web-components-helpers/)
(the full six-helper `<lily-*-picker>` catalog, a maintainer-directed
independent copy of `lily-design-system-html-helpers`) — and helps an agent
decide which one a given request actually needs. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, so an agent routing between the two Web Components subprojects is
grounded in the same rules each of them is held to.

Unlike every other framework family in this monorepo (HTML, Svelte, React,
Vue, Angular, Blazor, Nunjucks — each pairing a headless library with a
styled example application), Web Components has **no example
application**. `AGENTS/lily.md`'s "Subprojects for web app examples" list
carries exactly those seven entries, and no
`lily-design-system-web-components-*-examples` directory exists at the
repository root. This is a real, current gap, not an oversight this skill
should paper over — a maintainer could add one later, but as of this
writing none has.

This subproject sits one level above
[`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/)
and
[`lily-design-system-web-components-helpers-skill`](../lily-design-system-web-components-helpers-skill/):
those two carry the deep, per-subproject contract (the current scope
and its architecture decisions; the six helpers and their provenance
relationship to the HTML helpers catalog); this one is the map that routes
a request to the right one of the two.

## What this subproject is, and isn't

- **Is**: the Web Components umbrella and entry-point skill — a map of the
  two real Web Components subprojects, a decision guide for which one to
  reach for, a plain statement of the missing example application, and
  pointers into the two sibling skills and into the general Lily concepts
  skill rather than a restatement of any of them.
- **Isn't**: the Web Components headless catalog or the Web Components
  helpers catalog themselves — it ships no components, no custom elements,
  no helper packages of its own. Isn't the general Lily concepts skill
  (that's [`lily-design-system-skill`](../lily-design-system-skill/)).
  Isn't a duplicate of
  [`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/)
  or
  [`lily-design-system-web-components-helpers-skill`](../lily-design-system-web-components-helpers-skill/) —
  it points at both rather than restating their contracts. Isn't a claim
  that a Web Components example application exists — it explicitly states
  that one does not, unlike every other framework family's umbrella.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
