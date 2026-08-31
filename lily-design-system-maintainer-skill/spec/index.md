# Lily Design System — Maintainer Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan this subproject implements one half of.

## 1. Role in the ecosystem

A Claude Skill that packages the *maintainer* workflow for the Lily Design
System monorepo: the required-files layout, the `bin/` tooling, the
spec-driven development workflow, and pointers into the binding
`AGENTS/*.md` design-principle rules. It is content and documentation, not
a component implementation — it ships no headless components, no example
app, no helper packages.

Its sibling, [`lily-design-system-skill`](../../lily-design-system-skill/),
covers the *consumer* side (concepts, terminology, composition patterns).
Both packages now follow the `lily-design-system-` naming convention (as
of 2026-08-31; `lily-design-system-skill` was renamed from `lily-skill`,
which deliberately sat outside it) and get the same full-subproject
treatment.

## 2. Scope

### In scope

- `SKILL.md` — the skill: repository shape, required-files checklists, the
  add-a-component workflow, the `bin/` tool table, and pointers into the
  `AGENTS/*.md` rules.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the 14 special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  20 implementation subprojects.

### Explicitly out of scope

- Restating the `AGENTS/*.md` rules in full — `SKILL.md` points at them so
  the root files stay the single source of truth and this doesn't drift.
- Any component implementation, example page, or helper package.

## 3. Architecture

A single `SKILL.md` file (Claude Skill format: YAML frontmatter with
`name`, `description`, `license`, followed by Markdown instructions),
plus the standard subproject scaffolding. No build step, no dependencies,
no tests to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] The 14 special files present via `bin/sync-special-files`.
- [x] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened (tracked in
      [spec/trusted-publishing/index.md](../../spec/trusted-publishing/index.md)-style
      release tracking once it happens; not yet done as of 2026-08-30).

## 5. Related topics

- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  plan this subproject and `lily-design-system-skill` both implement.
- [spec/architecture/index.md](../../spec/architecture/index.md) — the
  monorepo layout and the required-files convention this subproject
  follows.
- [spec/special-files-for-public-repos/index.md](../../spec/special-files-for-public-repos/index.md) —
  the 14-file contract every public subtree repo carries.
