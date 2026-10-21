# Lily Design System™ — Alpine.js Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume
[`@lilydesignsystem/alpine-headless`](../lily-design-system-alpine-headless/):
Lily's ninth headless catalog (added 2026-10-21), covering all 571 components
as annotated HTML snippets plus one Alpine.js plugin. It is the
framework-specific counterpart, for this catalog, to the general
[`lily-design-system-skill`](../lily-design-system-skill/), and follows the
`lily-design-system-` prefix that marks the monorepo's implementation
subprojects.

## What it's for

Load this skill when someone asks how to use Lily with Alpine.js, wants the
snippet-plus-plugin idiom, asks which components have behaviour, or needs a
behaviour's `x-bind` names, keys and `lily:*` events. It does not restate the
root `AGENTS/*.md` rules or the Alpine package's own `spec/index.md`; it
points at them so the underlying source stays the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself.
- [`AGENTS.md`](AGENTS.md) and [`AGENTS/`](AGENTS/) — the modular agent docs.
- [`spec/index.md`](spec/index.md) — this subproject's specification.

Lily™ and Lily Design System™ are trademarks.
