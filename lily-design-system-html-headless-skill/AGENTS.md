# Lily Design System™ — HTML Headless Skill

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

- **Package**: lily-design-system-html-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume
[`lily-design-system-html-headless`](../lily-design-system-html-headless/),
the plain-HTML implementation of Lily's canonical component catalog. The
skill itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above
are the same binding design-principle rules every other subproject in this
repository loads, so an agent explaining the HTML headless consumption idiom
is grounded in the same rules the HTML headless library itself is held to.

Each component in that library is a self-contained `components/{kebab-case}.html`
file: an HTML comment documenting the component (description, canonical
HTML tag, CSS class, keyboard contract, accessibility notes, a usage
example), the markup itself carrying the kebab-case base class + ARIA, and,
only where the component needs interactivity, an embedded `<script>` IIFE
reading and writing `data-*` attributes and ARIA state with vanilla
JavaScript — no TypeScript, no module loader, no bundler required to render
a component. Consumers copy the snippet or fetch/include it server-side.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* the HTML headless
  library — its file shape, its copy-and-use idiom, and how its class-hook
  theming and naming conventions map onto the catalog-wide rules.
- **Isn't**: the HTML headless library itself (that's
  [`lily-design-system-html-headless`](../lily-design-system-html-headless/));
  isn't the general Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)); isn't the
  `*-picker` helpers skill (that's
  [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/));
  and isn't the skill for the separate, partial Web Components headless
  catalog (456/491 components, its full achievable scope, as native custom elements — a distinct
  subproject with its own architecture decisions).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
