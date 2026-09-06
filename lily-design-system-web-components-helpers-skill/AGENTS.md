# Lily Design System™ — Web Components Helpers Skill

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

- **Package**: lily-design-system-web-components-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume
[`lily-design-system-web-components-helpers`](../lily-design-system-web-components-helpers/),
the catalog of six opinionated `<lily-*-picker>` web-component helpers —
`theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, `date-time-picker` — that sit alongside the Web Components
headless catalog. The skill itself is [`SKILL.md`](SKILL.md); the
`@AGENTS/*.md` files loaded above are the same binding design-principle
rules every other subproject in this repository loads, so an agent
explaining the Web Components helpers consumption idiom is grounded in the
same rules the catalog itself is held to.

This catalog is a maintainer-directed (2026-09-03) **independent copy** of
[`lily-design-system-html-helpers`](../lily-design-system-html-helpers/) —
which is itself already six vanilla custom elements. It differs only in
tag prefix (`<lily-theme-picker>` rather than bare `<theme-picker>`,
matching the Web Components headless catalog's `lily-{slug}` tag
convention) and in package naming. Nothing ports between the two catalogs
automatically: a change to one must be applied to the other deliberately.
The Svelte catalog (`lily-design-system-svelte-helpers`) remains canonical
for the behavioural contract both HTML-family catalogs implement.

Four of the six render one shared shape — an icon button opening a
`role="listbox"` dropdown, implementing the WAI-ARIA APG listbox keyboard
pattern in JavaScript (never a native `<select>`). `share-picker` is a
disclosure of real `<a>` elements, because its destinations are navigation.
`date-time-picker` is a form control: a typeable text field plus a trigger
opening a WAI-ARIA APG date-picker dialog. Full contracts live in the
catalog's own `AGENTS.md` and each helper's `spec/index.md`, which this
skill points at rather than restates.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* the Web Components
  helpers catalog — the six helpers and what each owns, the three markup
  shapes, the attribute/property/event contract, and the precise
  provenance relationship to the HTML helpers catalog this one was copied
  from.
- **Isn't**: the general Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). Isn't the
  Web Components helpers catalog itself (that's
  [`lily-design-system-web-components-helpers`](../lily-design-system-web-components-helpers/)) —
  it ships no helper packages of its own. Isn't the Web Components headless
  skill (that's
  [`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/)),
  which covers the neighbouring (456/491, its full achievable scope) component catalog. Isn't
  the HTML helpers skill (that's
  [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/))
  — the two catalogs are independently maintained and this skill must never
  imply they are the same package or that changes sync automatically
  between them.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
