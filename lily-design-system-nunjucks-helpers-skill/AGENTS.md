# Lily Design System™ — Nunjucks Helpers Skill

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

- **Package**: lily-design-system-nunjucks-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume
[`lily-design-system-nunjucks-helpers`](../lily-design-system-nunjucks-helpers/),
Lily's Nunjucks port of the six `*-picker` helper packages: the
macro-plus-`client.js` split forced by Nunjucks' server-only rendering
(the macro renders markup and `data-lily-*` hooks; a companion ES module
owns storage, DOM application, and interaction), the shared icon-button-
opens-listbox contract the four preference helpers share, `share-picker`'s
disclosure-of-real-links shape, `date-time-picker`'s field-plus-APG-dialog
shape, and `motion-picker`'s one documented deviation — its initial value
can't call `matchMedia` at template-render time, so the macro marks
`motions[0]` selected and the client corrects it on init. The skill itself
is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the
same binding design-principle rules every other subproject in this
repository loads — including `@AGENTS/nunjucks.md`, which this subproject
pulls in specifically because it is scoped to one framework rather than
all seven.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming*
  `lily-design-system-nunjucks-helpers` — the six helpers' contracts, the
  macro-plus-client.js split unique to this catalog, and the
  no-JavaScript degradation story for each helper.
- **Isn't**: the Nunjucks helpers catalog itself (that's
  [`lily-design-system-nunjucks-helpers`](../lily-design-system-nunjucks-helpers/),
  which ships the six packages this skill explains how to use), isn't the
  general framework-agnostic Lily skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)), and isn't
  the Nunjucks headless-catalog skill (that's
  [`lily-design-system-nunjucks-headless-skill`](../lily-design-system-nunjucks-headless-skill/)).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
