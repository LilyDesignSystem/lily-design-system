# Lily Design System™ — React Headless Skill

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

- **Package**: lily-design-system-react-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to install, import, and use the React
headless implementation of Lily Design System™:
[`lily-design-system-react-headless`](../lily-design-system-react-headless/)
(npm, React 19, 491-component catalog). The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the
same binding design-principle rules every other subproject in this
repository loads, so an agent explaining the React headless library's
usage is grounded in the same rules that library's own implementation
is held to.

## What this subproject is, and isn't

- **Is**: a distributable skill covering how to consume
  `lily-design-system-react-headless` in a React application — install,
  import, JSX conventions (`className`, rest-props spreading,
  controlled `value`/`onChange` and `open`/`onChange` patterns) — for
  people building *with* it.
- **Isn't**: the React headless library itself (that's
  [`lily-design-system-react-headless`](../lily-design-system-react-headless/),
  which ships the actual components), isn't the general
  framework-agnostic Lily skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)), and
  isn't the React `*-picker` helpers skill (that's
  [`lily-design-system-react-helpers-skill`](../lily-design-system-react-helpers-skill/)).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
