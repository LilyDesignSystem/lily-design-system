# Lily Design System™ — Blazor Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan this subproject extends with a framework-scoped skill.

## 1. Role in the ecosystem

A Claude Skill that explains how to install and use
[`lily-design-system-blazor-headless`](../../lily-design-system-blazor-headless/):
the NuGet package identity and publish status, the Blazor/Razor-specific
consumption idiom (`CssClass` instead of `class`, `RenderFragment
ChildContent`, `EventCallback<T>`/native-attribute wiring,
`AdditionalAttributes` pass-through), and pointers into the framework-agnostic
naming and composition references. It is content and documentation, not a
component implementation — it ships no Razor components, no tests beyond its
own required-files check.

Its siblings:

- [`lily-design-system-skill`](../../lily-design-system-skill/) covers
  framework-agnostic Lily concepts (headless-vs-example, the catalog,
  naming conventions, composition patterns).
- [`lily-design-system-blazor-helpers-skill`](../../lily-design-system-blazor-helpers-skill/)
  covers the Blazor `*-picker` helpers catalog — a separate set of NuGet
  packages with their own opinionated icon-button/listbox contract, not
  covered here.

## 2. Scope

### In scope

- `SKILL.md` — the skill: `lily-design-system-blazor-headless` package
  identity and install, the Blazor/Razor consumption idiom, theming, and
  pointers to the canonical naming/composition references.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since it
  follows the `lily-design-system-*` naming convention and `bin/test` holds
  it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Blazor headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root files and
  the headless subproject's own spec stay the single source of truth.
- Any component implementation. This skill teaches consumption of
  `lily-design-system-blazor-headless`; it does not ship, modify, or test
  that library's `.razor` components.
- The Blazor `*-picker` helpers catalog — that's
  `lily-design-system-blazor-helpers-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests to
run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [x] Every concrete fact in `SKILL.md` (package id, publish status, Razor
      idioms) is grounded in the Blazor headless subproject's own
      `AGENTS.md`/`spec/index.md` and the root `CHANGELOG.md`, not invented.
- [ ] A `.git-subtree-push` remote is actually configured and the first push
      to a standalone public repository has happened; not yet done as of
      2026-09-04.

## 5. Related topics

- [`../../lily-design-system-blazor-headless/spec/index.md`](../../lily-design-system-blazor-headless/spec/index.md) —
  the Blazor headless library's own spec: the source of truth for every
  Razor-component fact this skill teaches.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic consumer skill this subproject narrows to Blazor.
- [`../../spec/agent-skills/index.md`](../../spec/agent-skills/index.md) —
  the two-skill (consumer/maintainer) plan this and the Blazor helpers skill
  extend with framework-scoped skills.
