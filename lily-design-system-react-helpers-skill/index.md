# Lily Design System™ — React Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install
and use the React implementation of Lily Design System™'s six
`*-picker` helper packages: `theme-picker`, `locale-picker`,
`text-size-picker`, `motion-picker`, `share-picker`, and
`date-time-picker`. Each ships as its own npm package under
[`lily-design-system-react-helpers/`](../lily-design-system-react-helpers/).

It is one of two React-scoped skills, alongside
[`lily-design-system-react-headless-skill`](../lily-design-system-react-headless-skill/),
which covers the headless component catalog instead of the helper
packages. Both are narrower siblings of the general
[`lily-design-system-skill`](../lily-design-system-skill/), which
explains Lily concepts independent of any one framework.

## What it's for

Load this skill when someone asks how to install or use Lily Design
System's React theme/locale/text-size/motion/share/date-time picker,
wants the React-specific helper idiom (controlled
`value`/`onChange`, render-prop `children`, SSR / `"use client"`
boundaries), or hits a re-entrant apply / infinite-loop bug wiring a
picker's `onChange` back into its own `value`. It doesn't restate the
`AGENTS/helpers.md` contract or each helper's own `spec/index.md` in
full — it points at them, so the underlying source stays the single
source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers'
  package names and one-line contracts, the three root shapes
  (icon-button-plus-listbox, disclosure-of-links,
  field-plus-dialog), the React consumption idiom, and the
  idempotent-apply guard's React-specific relevance.

Scaffolded to match the other implementation subprojects — including
the standard required-files set and the
[`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such
remote exists yet.
