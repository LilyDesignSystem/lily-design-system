# Lily Design System™ — Blazor Headless Skill

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

- **Package**: lily-design-system-blazor-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to install and use
[`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/),
the Blazor .NET 10 / C# implementation of Lily's headless component catalog.
The skill itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded
above are the same binding design-principle rules every other subproject in
this repository loads, so an agent explaining Blazor consumption is grounded
in the same rules the Blazor headless library itself is held to.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* Lily's Blazor headless
  component library — package install, the `CssClass`/`RenderFragment`/
  `EventCallback`/`AdditionalAttributes` idiom, and where to find the
  framework-agnostic naming and composition references.
- **Isn't**: the Blazor headless library itself (that's
  [`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/) —
  this subproject ships no components, no `.razor` files, no tests beyond its
  own required-files check).
- **Isn't**: the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)).
- **Isn't**: the Blazor `*-picker` helpers skill (that's
  [`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/) —
  helpers are a separate catalog with their own NuGet packages and a
  different, opinionated icon-button/listbox contract).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
