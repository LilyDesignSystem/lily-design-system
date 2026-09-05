# Lily Design System™ — Svelte Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to install and
consume [`lily-design-system-svelte-headless`](../lily-design-system-svelte-headless/),
the Svelte 5 implementation of Lily's 491-component headless catalog: the
npm package identity, the Svelte 5 runes-specific consumption idiom (the
`class` prop, `$props()` with rest-props, `$bindable()` for open/close
state), and where to find the catalog-wide naming and composition rules.

It is a framework-specific sibling of
[`lily-design-system-skill`](../lily-design-system-skill/), which covers
Lily's concepts and terminology across all seven frameworks, and shares the
`lily-design-system-` prefix with the monorepo's implementation
subprojects, because it is fully bound to this repository's own Svelte
headless subproject and its conventions, not a portable general-purpose
package.

## What it's for

Load this skill when someone asks how to install or import Lily's Svelte
headless components, wants the Svelte 5-specific usage idiom for a Lily
component, needs the npm package name, or asks how theming and class hooks
work in the Svelte catalog. It doesn't restate the `AGENTS/*.md` rules,
the suffix→element mapping, or the composition patterns in full — it
points at them, so the underlying source stays the single source of
truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: package identity, install
  command, the Svelte 5 consumption idiom, theming, and pointers to the
  catalog-wide naming/composition references.

Scaffolded to the same full-subproject bar as its siblings
(`lily-design-system-skill`, `lily-design-system-maintainer-skill`,
`lily-design-system-svelte-helpers-skill`) — including the required
`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
and the [`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such remote
exists yet.
