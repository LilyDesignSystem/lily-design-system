# Lily Design System™ — Angular Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume
[`lily-design-system-angular-headless`](../lily-design-system-angular-headless/):
installing the package, the Angular-specific standalone-component and
element-selector idiom, and — the one genuinely Angular-specific wrinkle —
the tag+attribute-selector convention that 51 list-item and table
sub-element components use instead of a plain custom tag.

It is the Angular-headless-specific counterpart to
[`lily-design-system-skill`](../lily-design-system-skill/), which covers
Lily's framework-agnostic concepts, and it is a sibling of
[`lily-design-system-angular-helpers-skill`](../lily-design-system-angular-helpers-skill/),
which covers the Angular `*-picker` helper catalog instead of the headless
component library.

## What it's for

Load this skill when someone asks how to install or import the Angular
headless library, wants a working Angular usage example for a Lily
component, or is confused about why a `*ListItem` or table sub-element
component is written as `<li lily-breadcrumb-list-item>` rather than
`<lily-breadcrumb-list-item>`. It doesn't restate the `AGENTS/*.md` rules,
the naming/suffix mapping, or the Angular headless subproject's own
`spec/index.md` in full — it points at them, so the underlying source
stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: package identity, the
  Angular-specific consumption idiom, the element-selector vs.
  tag+attribute-selector convention, theming/class hooks, and pointers to
  the catalog-wide naming and composition references.

Scaffolded to the same full-subproject bar as its siblings
(`lily-design-system-skill`, `lily-design-system-maintainer-skill`,
`lily-design-system-angular-helpers-skill`) — including `index.md`,
`README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, and
`.git-subtree-push` — so it can be pushed to its own standalone public
repository the same way once that remote is configured; as of this writing
no such remote exists yet.
