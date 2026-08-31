# Lily Design System™ — Maintainer Skill

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

- **Package**: lily-design-system-maintainer-skill
- **Version**: 0.1.0
- **Created**: 2026-08-30
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill packaging the technical, maintainer-facing workflow for the
Lily Design System monorepo. The skill itself is [`SKILL.md`](SKILL.md); the
`@AGENTS/*.md` files loaded above are the same binding design-principle
rules every other subproject in this repository loads, because a maintainer
touching any of them needs the same rules a component implementation is
held to.

## What this subproject is, and isn't

- **Is**: a distributable skill, scoped to *this repository's own tooling
  and conventions* — the required-files layout, `bin/`, the spec-driven
  workflow, the add-a-component procedure.
- **Isn't**: end-user-facing documentation of Lily Design System concepts
  (that's [`lily-design-system-skill`](../lily-design-system-skill/)), and
  isn't itself a framework headless/example/helpers implementation — it
  ships no components.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
