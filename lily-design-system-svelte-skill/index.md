# Lily Design System™ — Svelte Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that maps Lily Design System's three
real Svelte subprojects — the headless component library, the canonical
`*-picker` helpers catalog, and the SvelteKit example application — and
helps an agent decide which one a task needs.

It is an **umbrella skill**, one level up from the two framework-specific
skills that already cover the headless library and the helpers catalog in
depth: [`lily-design-system-svelte-headless-skill`](../lily-design-system-svelte-headless-skill/)
and [`lily-design-system-svelte-helpers-skill`](../lily-design-system-svelte-helpers-skill/).
This skill does not restate their content; it points to them, and gives the
SvelteKit example app — the one Svelte subproject neither sibling skill
covers — its own real coverage: required routes, NHS UK visual reference,
how to run it, and its distinctive axe-catalog and visual-regression test
suites.

## What it's for

Load this skill when someone asks what's available for Svelte in Lily
Design System, which Svelte subproject they need (the headless library, the
canonical `*-picker` helpers, or the SvelteKit example app), or wants to see
Svelte components styled and running. For the headless library's
consumption idiom or the helpers catalog's per-helper contracts, this skill
hands off to its two siblings rather than duplicating them.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the three-subproject map,
  pointers to the two sibling skills, the SvelteKit example app's own
  coverage, and the Svelte-wide conventions that span all three
  subprojects.

## Scaffolding note

Scaffolded to match the other implementation subprojects — including the
required files (`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`,
`spec/index.md`) — and lives only in this monorepo (its standalone subtree
repository was deleted 2026-10-10).
