# Lily Design System™ — Nunjucks Headless Skill

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

- **Package**: lily-design-system-nunjucks-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume
[`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless/),
Lily's Nunjucks-macro implementation of the 491-component catalog: the
macro-call idiom (a single `params` object per macro, the `classes` /
`attributes` / `text` / `html` shared keys), the camelCase-macro versus
kebab-case-file/class naming split that Nunjucks' own identifier syntax
forces, and composing nested components via `{% call %}` blocks and
`caller()`. The skill itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md`
files loaded above are the same binding design-principle rules every other
subproject in this repository loads — including `@AGENTS/nunjucks.md`,
which this subproject pulls in specifically because it is scoped to one
framework rather than all seven.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming*
  `lily-design-system-nunjucks-headless` — the macro-call conventions,
  `params` shape, and server-rendering behaviour a Nunjucks consumer needs.
- **Isn't**: the Nunjucks headless library itself (that's
  [`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless/),
  which ships the 491 macros this skill explains how to call), isn't the
  general framework-agnostic Lily skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)), and isn't
  the Nunjucks `*-picker` helpers skill (that's
  [`lily-design-system-nunjucks-helpers-skill`](../lily-design-system-nunjucks-helpers-skill/)).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
