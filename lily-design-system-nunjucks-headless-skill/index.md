# Lily Design System™ — Nunjucks Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume
[`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless/):
the macro-call idiom (a single `params` object, `classes`, `attributes`,
`text`/`html`), the camelCase-macro/kebab-case-file naming split Nunjucks
syntax forces, composing components via `{% call %}`/`caller()`, and
server-rendering-specific notes for a library that ships no client
runtime at all.

It is the Nunjucks-specific counterpart to
[`lily-design-system-skill`](../lily-design-system-skill/), which covers
framework-agnostic Lily concepts, and the sibling of
[`lily-design-system-nunjucks-helpers-skill`](../lily-design-system-nunjucks-helpers-skill/),
which covers the `*-picker` helpers catalog instead of the headless
component catalog.

## What it's for

Load this skill when someone asks how to import or call a Lily Nunjucks
macro, wants the `params` shape for a component, needs to pass a class
hook or arbitrary HTML attributes into a macro, wants to nest components
(a breadcrumb trail, a table, a form) via `{% call %}`, or asks about
Eleventy / server-side Nunjucks integration for Lily. It doesn't restate
`AGENTS/nunjucks.md` or `AGENTS/components.md` in full — it points at
them, so the underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: macro-call idiom, the
  camelCase/kebab-case split, `{% call %}`/`caller()` composition,
  theming, server-rendering notes.

Scaffolded to the same full-subproject bar as its siblings
(`lily-design-system-skill`, `lily-design-system-maintainer-skill`,
`lily-design-system-nunjucks-helpers-skill`) — including the required
`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
and `.git-subtree-push` — so it can be pushed to its own standalone public
repository the same way once that remote is configured.
