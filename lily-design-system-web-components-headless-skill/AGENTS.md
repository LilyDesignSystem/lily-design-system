# Lily Design System™ — Web Components Headless Skill

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

- **Package**: lily-design-system-web-components-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume
[`lily-design-system-web-components-headless`](../lily-design-system-web-components-headless/),
the native-custom-element implementation of a **deliberately partial**
slice of Lily's canonical component catalog: 33 of the 491 components,
added 2026-09-03, spanning every major category rather than clustering in
one, proving the pattern rather than claiming parity with the seven
full-catalog headless libraries. The skill itself is [`SKILL.md`](SKILL.md);
the `@AGENTS/*.md` files loaded above are the same binding design-principle
rules every other subproject in this repository loads, so an agent
explaining the Web Components headless consumption idiom is grounded in the
same rules the library itself is held to.

The library ships plain TypeScript classes extending `HTMLElement`, no
framework, no JSX, no build-time template compiler, registered as
`customElements.define("lily-{slug}", X)`. Two architecture decisions
shape every component: **autonomous custom elements**, never customized
built-ins (`is="..."`), because WebKit has never implemented the
customized-built-in half of the spec and has stated it will not; and
**light DOM only**, no shadow root, so consumer CSS reaches every element
the same way it does in the other seven catalogs. Full rationale and the
two structural patterns components use (wrap a real native element;
self-is-the-wrapper) live in the library's own `AGENTS.md` and
`spec/index.md`, which this skill points at rather than restates.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* the Web Components
  headless catalog — its partial scope (which 33 components), its
  custom-element usage idiom, its two architecture decisions, and how its
  class-hook theming and naming conventions map onto the catalog-wide
  rules.
- **Isn't**: a full-parity 491/491 catalog, and never described as one —
  every claim in this skill is scoped to the 33 components this library
  actually ships. Isn't the general Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). Isn't the
  Web Components headless library itself (that's
  [`lily-design-system-web-components-headless`](../lily-design-system-web-components-headless/)) —
  it ships no components of its own. Isn't the Web Components `*-picker`
  helpers skill (that's
  [`lily-design-system-web-components-helpers-skill`](../lily-design-system-web-components-helpers-skill/)),
  a separate, independently maintained catalog.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
