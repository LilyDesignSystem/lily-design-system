# Lily Design System™ — Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan this subproject implements one half of.

## 1. Role in the ecosystem

A Claude Skill that explains Lily Design System™ concepts, terminology, and
usage patterns to people building *with* it: the headless-vs-example
layers, the 491-component catalog, naming conventions, composition
patterns, theming, and the seven supported frameworks. It is content and
documentation, not a component implementation — it ships no headless
components, no example app, no helper packages.

Its sibling, [`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/),
covers the *maintainer* side: the required-files layout, the `bin/`
tooling, and the spec-driven workflow for people working *on* this
repository's own codebase. Both skills follow the `lily-design-system-`
naming convention as of 2026-08-31 (renamed from `lily-skill`, which
deliberately sat outside it — see
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for why
that split was retired).

## 2. Scope

### In scope

- `SKILL.md` — the skill: Lily's concepts, terminology, naming
  conventions, composition patterns, and framework choice.
- `reference/*.md` — `naming-and-catalog.md` and
  `composition-patterns.md`, loaded on demand.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the 14 special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating the `AGENTS/*.md` rules or the `spec/` topic docs in full —
  `SKILL.md` and `reference/*.md` point at them so the root files stay the
  single source of truth.
- Any component implementation, example page, or helper package.
- Maintainer-facing tooling and workflow content — that's
  `lily-design-system-maintainer-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions) plus
`reference/*.md`, plus the standard subproject scaffolding. No build step,
no dependencies, no tests to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] The 14 special files present via `bin/sync-special-files`.
- [x] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-08-31.

## 5. Related topics

- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  plan this subproject and `lily-design-system-maintainer-skill` both
  implement, and the naming-split retirement this rename completed.
- [spec/architecture/index.md](../../spec/architecture/index.md) — the
  monorepo layout and the required-files convention this subproject
  follows.
- [spec/special-files-for-public-repos/index.md](../../spec/special-files-for-public-repos/index.md) —
  the 14-file contract every public subtree repo carries.
