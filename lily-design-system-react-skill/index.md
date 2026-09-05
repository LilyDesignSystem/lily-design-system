# Lily Design System™ — React Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that maps the three real React
subprojects in this monorepo — the headless component library, the
`*-picker` helpers catalog, and the Next.js example app — and helps an
agent decide which one it needs.

It is the React **umbrella** skill: it sits one level up from
[`lily-design-system-react-headless-skill`](../lily-design-system-react-headless-skill/)
and
[`lily-design-system-react-helpers-skill`](../lily-design-system-react-helpers-skill/),
which each go deep on exactly one of those subprojects, and one level
down from [`lily-design-system-skill`](../lily-design-system-skill/),
which covers Lily's concepts independent of any one framework.

## What it's for

Load this skill when someone asks what's available for React in Lily
Design System, which React subproject they need (the headless library
you depend on and style yourself, the six page-header `*-picker`
helpers, or the fully-styled Next.js reference app), or wants to see
Lily's React components styled and running. It does not restate the
headless or helpers skills' install commands, prop conventions, or
gotchas — it points at them. It does give the Next.js example app real
coverage (routes, NHS UK styling, how to run it, App Router / client-
component boundaries), since neither sibling skill covers that
subproject.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map,
  pointers to the two sibling skills, example-app coverage, and the
  React-wide conventions verified across all three.

Scaffolded to match the other implementation subprojects — including
the 12 copied + 2 generated special files and the
[`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such
remote exists yet.
