# Lily Design System™ — Alpine.js Headless Skill — Specification

Living specification for this subproject. For project-wide rules read the
root [spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the skill
tiers.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`@lilydesignsystem/alpine-headless`](../../lily-design-system-alpine-headless/),
the ninth headless catalog (added 2026-10-21): all 571 components as
annotated HTML snippets plus one Alpine plugin. It is content, not a
component implementation. Its siblings are the framework-specific
`*-headless-skill` packages; unlike most there is no `alpine-helpers-skill`
or umbrella `alpine-skill`, because Alpine has no helpers or example app yet.

## 2. Scope

### In scope

- `SKILL.md`: the snippet-plus-plugin idiom, the behaviour table, events,
  gotchas, testing, and what is not built.

### Out of scope

- Restating root `AGENTS/*.md` rules or the Alpine package's spec.
- An Alpine example app or helper packages (not built; see the package spec).

## 3. Acceptance criteria

- [x] `SKILL.md` has valid frontmatter whose `name` equals the directory name.
- [x] Counts and behaviour names match `lily-design-system-alpine-headless`.
- [x] Required files present (`index.md`, `README.md` symlink, `AGENTS.md`, `spec/index.md`).
- [ ] Re-check against the package whenever its behaviours or events change.

## Related topics

[agent-skills](../../spec/agent-skills/index.md), [Alpine headless spec](../../lily-design-system-alpine-headless/spec/index.md).

Lily™ and Lily Design System™ are trademarks.
