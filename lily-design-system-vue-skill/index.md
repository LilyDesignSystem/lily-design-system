# Lily Design System™ — Vue Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that ties together the three real
Vue subprojects in this monorepo — the headless component library, the
`*-picker` helpers catalog, and the Nuxt.js example application — helps an
agent decide which one it needs, and points into the two more specific
sibling skills that already exist
([`lily-design-system-vue-headless-skill`](../lily-design-system-vue-headless-skill/),
[`lily-design-system-vue-helpers-skill`](../lily-design-system-vue-helpers-skill/))
rather than duplicating their content. It sits one level up from those two.

It is one of the sixteen framework-specific skills added 2026-09-04
alongside the general [`lily-design-system-skill`](../lily-design-system-skill/)
and the maintainer-facing
[`lily-design-system-maintainer-skill`](../lily-design-system-maintainer-skill/).

## What it's for

Load this skill when someone asks what's available for Vue in Lily Design
System, which Vue subproject they need, or wants to see Vue components
styled and running. It gives real, standalone coverage of
`lily-design-system-vue-nuxt-examples` — the one of the three real Vue
subprojects that neither sibling skill covers — and otherwise points at the
sibling skills or `lily-design-system-skill` rather than restating them.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map, the
  example app's routes and Nuxt specifics, and the Vue-wide conventions
  that span all three.

## Scaffolding note

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
