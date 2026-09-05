# Lily Design System™ — Svelte Skill

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
@AGENTS/sveltekit.md

## Metadata

- **Package**: lily-design-system-svelte-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill that maps Lily Design System's three real Svelte
subprojects — the headless component library
([`lily-design-system-svelte-headless`](../lily-design-system-svelte-headless/)),
the canonical `*-picker` helpers catalog
([`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)),
and the SvelteKit example application
([`lily-design-system-svelte-sveltekit-examples`](../lily-design-system-svelte-sveltekit-examples/))
— and helps an agent decide which one a task needs. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, plus `AGENTS/sveltekit.md` for the Svelte 5 + SvelteKit 2
conventions that span all three Svelte subprojects, so an agent using this
skill to route a task is grounded in the same rules those subprojects are
held to.

## What this subproject is, and isn't

- **Is**: the Svelte umbrella/entry-point skill — a map of the three real
  Svelte subprojects, a decision aid for which one a task needs, real
  coverage of the SvelteKit example app (the one subproject neither sibling
  skill covers), and pointers into the two sibling skills for the headless
  library and the helpers catalog.
- **Isn't**: the headless library, the helpers catalog, or the example app
  themselves — it ships no components, no helper packages, no example
  pages. Isn't the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). Isn't a
  duplicate of either sibling skill —
  [`lily-design-system-svelte-headless-skill`](../lily-design-system-svelte-headless-skill/)
  owns the headless library's consumption idiom, and
  [`lily-design-system-svelte-helpers-skill`](../lily-design-system-svelte-helpers-skill/)
  owns the helpers catalog's per-helper contracts; this skill sits one
  level above both and points at them rather than restating them.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
