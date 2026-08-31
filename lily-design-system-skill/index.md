# Lily Design System™ — Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains Lily Design System™
concepts, terminology, and usage patterns to people building *with* it: the
headless-vs-example layers, the 491-component catalog, naming conventions,
composition patterns, theming, and the seven supported frameworks.

It is the consumer-facing counterpart to
[`lily-design-system-maintainer-skill`](../lily-design-system-maintainer-skill/),
which packages the technical workflow for maintaining this monorepo itself.
Both now follow the `lily-design-system-` prefix that marks the monorepo's
implementation subprojects, because both are: fully bound to this
repository's own tooling and conventions, not portable general-purpose
packages living outside it.

## What it's for

Load this skill when someone asks what Lily Design System is, what a Lily
term means (headless, class hook, slug, helper, theme), how to compose a
Lily pattern (a form, a nav, a table, a page shell), or wants a working
example in a given framework. It doesn't restate the `AGENTS/*.md` rules or
the `spec/` topic docs in full — it points at them, so the underlying
source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: concepts, terminology, naming
  conventions, composition patterns, framework choice.
- [`reference/`](reference/) — `naming-and-catalog.md` and
  `composition-patterns.md`, loaded on demand.

Scaffolded to match the other implementation subprojects — including the
12 copied + 2 generated special files and the
[`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such remote
exists yet.
