# Lily Design System™ — Web Components Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that ties together the two real
native-Web-Components subprojects in this monorepo — the (456/491, its full achievable scope)
headless custom-element catalog and the six-helper `<lily-*-picker>`
catalog — and helps an agent decide which one a given request actually
needs.

It sits one level above
[`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/)
and
[`lily-design-system-web-components-helpers-skill`](../lily-design-system-web-components-helpers-skill/):
those two carry the deep, per-subproject contract; this one is the map
that routes a request to the right one of the two, and states plainly the
fact that a Web Components example application does not exist yet — every
other framework family in this monorepo ships one, Web Components does
not.

## What it's for

Load this skill when someone asks what's available as native Web
Components in Lily Design System, which Web Components subproject they
need (the partial headless catalog or the `*-picker` helpers), how the two
relate to each other or to the HTML catalogs they're modeled on, or asks
whether there's a Web Components example app. It doesn't restate the
`AGENTS/*.md` rules, the `spec/` topic docs, or either sibling skill's own
content in full — it points at them, so the underlying source stays the
single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the two-subproject map, the
  no-example-app gap, and the distinction from the plain-HTML catalogs.

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
