# Lily Design System™ — Angular Helpers Skill

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

- **Package**: lily-design-system-angular-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume the
[`lily-design-system-angular-helpers`](../lily-design-system-angular-helpers/)
catalog: six opinionated Angular packages
(`lily-design-system-angular-theme-picker`,
`-locale-picker`, `-text-size-picker`, `-motion-picker`, `-share-picker`,
`-date-time-picker`) that each own one complete interaction end to end,
alongside the pure-markup Angular headless catalog. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, including `helpers.md`, the shared `*-picker` contract this skill's
subject matter implements.

Its subject matter is narrower than
[`lily-design-system-skill`](../lily-design-system-skill/)'s: where that
skill covers Lily's concepts across all seven catalogs, this one is scoped
to what is actually different about consuming the picker helpers *in
Angular* — standalone components, signal `model()` two-way binding, and the
`$any($event.target).value` template-cast idiom Angular's template parser
requires in place of a parenthesised TypeScript cast.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming*
  `lily-design-system-angular-helpers` — installing each of the six
  packages, their shared and individual contracts, the Angular
  standalone-component/signal idiom, and SSR/idempotent-apply behaviour —
  portable to any Angular project that depends on Lily even outside this
  monorepo.
- **Isn't**: the Angular helpers catalog itself (that's
  [`lily-design-system-angular-helpers`](../lily-design-system-angular-helpers/)),
  the Angular headless component library or its skill (that's
  [`lily-design-system-angular-headless-skill`](../lily-design-system-angular-headless-skill/)),
  and isn't the general framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). It ships no
  components of its own.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
