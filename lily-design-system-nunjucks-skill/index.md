# Lily Design System™ — Nunjucks Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that ties together the three real
Nunjucks subprojects in this monorepo — the headless macro library, the
`*-picker` helpers catalog, and the Eleventy example app — and helps an
agent decide which one a task actually needs.

It sits one level above
[`lily-design-system-nunjucks-headless-skill`](../lily-design-system-nunjucks-headless-skill/)
and
[`lily-design-system-nunjucks-helpers-skill`](../lily-design-system-nunjucks-helpers-skill/),
which cover the headless macro-call idiom and the six helper packages in
depth. This skill does not duplicate either: it maps all three
subprojects, routes deeper questions to the matching sibling skill, and
gives the Eleventy example app — the one subproject neither sibling
skill covers — its own real treatment (required routes, the NHS UK visual
reference, how to run it, and its Nunjucks/Eleventy-specific integration
detail).

## What it's for

Load this skill when someone asks what's available for Nunjucks in Lily
Design System, which of the three Nunjucks subprojects they need, how the
headless library, the helpers catalog, and the example app relate to each
other, or wants to run or copy CSS from the styled Nunjucks/Eleventy
reference app. For the deep contract of the headless macros or the six
picker helpers, this skill hands off to its two siblings rather than
restating them.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map,
  pointers to the sibling skills, Eleventy example-app coverage, and the
  Nunjucks-wide conventions shared across all three subprojects.

Scaffolded to match the other implementation subprojects — including the
special files and the [`.git-subtree-push`](.git-subtree-push) config
`bin/git-subtree-push` reads — so it can be pushed to its own standalone
public repository the same way once that remote is configured; as of this
writing no such remote exists yet.
