# Lily Design System™ — Blazor Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that maps the three real Blazor
subprojects in this monorepo — the headless component library, the
`*-picker` helpers catalog, and the Blazor Web example app — and helps an
agent decide which one it needs.

It is the Blazor **umbrella** skill: one level up from
[`lily-design-system-blazor-headless-skill`](../lily-design-system-blazor-headless-skill/)
and [`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/),
which each cover exactly one of those subprojects in depth. This skill does
not restate their content — it points into them, and gives the third
subproject (the example app) its only skill-level coverage, since neither
sibling skill touches it.

## What it's for

Load this skill when someone asks what's available for Blazor in Lily
Design System, which Blazor subproject they need for a given job, how to
run the Blazor example app, or wants Blazor Web App hosting-model guidance.
For the headless library's own parameter idioms and known gotchas, or the
helpers' shared listbox contract and `IJSRuntime`/SSR pattern, this skill
hands off to its two siblings rather than duplicating them. For
framework-agnostic Lily concepts, it hands off to
[`lily-design-system-skill`](../lily-design-system-skill/).

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map,
  pointers to the two sibling skills, full example-app coverage (routes,
  NHS UK visual reference, how to run it, hosting model), and the
  Blazor-wide conventions that span all three subprojects.

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
