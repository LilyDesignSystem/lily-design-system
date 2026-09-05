# Lily Design System™ — Angular Headless Skill

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

- **Package**: lily-design-system-angular-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to consume
[`lily-design-system-angular-headless`](../lily-design-system-angular-headless/),
the Angular implementation of Lily's full 491-component headless catalog.
The skill itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded
above are the same binding design-principle rules every other subproject in
this repository loads, so an agent explaining Angular-headless consumption
is grounded in the same rules the Angular component implementation is held
to.

Its subject matter is narrower than
[`lily-design-system-skill`](../lily-design-system-skill/)'s: where that
skill covers Lily's concepts across all seven frameworks, this one is
scoped to what is actually different about consuming Lily *in Angular* —
standalone components, signal inputs, `OnPush`, and above all the
tag+attribute-selector convention the 51 list-item and table sub-element
components use so a required parent-child content-model relationship
(`<ol>`+`<li>`, `<table>`+`<thead>`, `<tr>`+`<th>`/`<td>`, `<select>`+
`<option>`) is never broken by an intervening wrapper element.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming*
  `lily-design-system-angular-headless` — installation, the Angular
  standalone-component idiom, the element-selector and
  tag+attribute-selector conventions, and theming/class hooks — portable to
  any Angular project that depends on Lily even outside this monorepo.
- **Isn't**: the Angular headless library itself (that's
  [`lily-design-system-angular-headless`](../lily-design-system-angular-headless/)),
  the general framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)), and isn't
  the Angular `*-picker` helpers skill (that's
  [`lily-design-system-angular-helpers-skill`](../lily-design-system-angular-helpers-skill/)).
  It ships no components of its own.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
