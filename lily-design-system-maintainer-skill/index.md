# Lily Design System™ — Maintainer Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that packages the technical
workflow for maintaining the [Lily Design System](https://github.com/LilyDesignSystem/lily-design-system)
monorepo: the required-files layout for subprojects and components, the
`bin/` tooling, the spec-driven development workflow, and pointers into the
binding `AGENTS/*.md` design-principle rules.

It is the maintainer-facing counterpart to [`lily-design-system-skill`](../lily-design-system-skill/),
which explains Lily Design System's concepts and usage to people building
*with* it rather than *on* it. Both packages follow the `lily-design-system-`
prefix that marks the monorepo's implementation subprojects, because both
are: fully bound to this repository's own tooling and conventions, not
portable general-audience references living outside it.

## What it's for

Load this skill when working inside a clone of the canonical monorepo:
adding a component, scaffolding a new subproject, auditing required files,
or running the verification/sync/publish tooling. It doesn't duplicate the
`AGENTS/*.md` rules — it points at them, and at the `spec/` topic docs, so
the underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: repository shape, the
  required-files checklists, the add-a-component workflow, the `bin/`
  tool table, and pointers into the design-principle docs.

Scaffolded to match the other 20 implementation subprojects — including the
12 copied + 2 generated special files and the [`.git-subtree-push`](.git-subtree-push)
config `bin/git-subtree-push` reads — so it can be pushed to its own
standalone public repository the same way once that remote is configured;
as of this writing no such remote exists yet.
