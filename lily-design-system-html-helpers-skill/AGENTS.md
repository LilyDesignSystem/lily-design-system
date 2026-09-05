# Lily Design System™ — HTML Helpers Skill

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

- **Package**: lily-design-system-html-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining
[`lily-design-system-html-helpers`](../lily-design-system-html-helpers/), the
catalog of six web-component `*-picker` helpers (`theme-picker`,
`locale-picker`, `text-size-picker`, `motion-picker`, `share-picker`,
`date-time-picker`) that sit alongside the HTML headless library. The skill
itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are
the same binding design-principle rules every other subproject in this
repository loads, so an agent explaining the HTML helpers is grounded in the
same rules the helpers themselves are held to — most directly
`@AGENTS/helpers.md`, the shared contract across all `*-picker` catalogs.

Each helper is a custom element extending `HTMLElement`, light-DOM-only,
registered via `customElements.define(...)` as a side effect of import. Four
of the six (theme, locale, text-size, motion) share one rendering shape —
an icon button opening a `role="listbox"` dropdown, the WAI-ARIA APG
listbox pattern implemented in JavaScript. `share-picker` renders a
disclosure of real `<a>` elements instead, because its destinations are
navigation. `date-time-picker` renders a typeable text field plus a trigger
opening a `role="dialog"` date-picker dialog, because it is a form control
rather than a page-header preference widget.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* the HTML `*-picker`
  helpers catalog — what each helper owns, its markup and keyboard
  contract, its attribute/property/event surface, and how it relates to
  the independent Web Components helpers copy.
- **Isn't**: the HTML helpers catalog itself (that's
  [`lily-design-system-html-helpers`](../lily-design-system-html-helpers/));
  isn't the HTML headless-library skill (that's
  [`lily-design-system-html-headless-skill`](../lily-design-system-html-headless-skill/));
  isn't the general Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)); and isn't the
  skill for the independent Web Components helpers copy (`<lily-*-picker>`
  tags), which has its own naming and provenance to explain.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
