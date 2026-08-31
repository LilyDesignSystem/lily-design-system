# Lily Design System™ — Skill

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

- **Package**: lily-design-system-skill
- **Version**: 0.1.0
- **Created**: 2026-08-30
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining Lily Design System™ concepts, terminology, and
usage patterns to people building *with* it. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, so an agent explaining Lily's concepts is grounded in the same rules
a component implementation is held to.

## What this subproject is, and isn't

- **Is**: a distributable skill covering Lily Design System's concepts,
  terminology, naming conventions, and composition patterns for consumers
  of the system, portable to any project that depends on Lily even outside
  this monorepo.
- **Isn't**: maintainer-facing documentation of *this repository's own*
  tooling and conventions (that's
  [`lily-design-system-maintainer-skill`](../lily-design-system-maintainer-skill/)),
  and isn't itself a framework headless/example/helpers implementation —
  it ships no components.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
