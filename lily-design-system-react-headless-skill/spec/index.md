# Lily Design System™ — React Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` and
`lily-design-system-maintainer-skill`) this subproject extends with a
React-specific pair.

## 1. Role in the ecosystem

A Claude Skill that explains how to install, import, and use the React
headless implementation of Lily Design System™: the
`lily-design-system-react-headless` npm package, its JSX consumption
idiom (`className`, rest-props spreading, controlled-prop patterns),
and pointers to the framework-agnostic naming and composition rules
that govern it. It is content and documentation, not a component
implementation — it ships no headless components, no example app, no
helper packages.

Its sibling, [`lily-design-system-react-helpers-skill`](../../lily-design-system-react-helpers-skill/),
covers the six React `*-picker` helper packages instead of the
headless catalog. Both are narrower, framework-scoped counterparts to
[`lily-design-system-skill`](../../lily-design-system-skill/), which
explains Lily concepts independent of any one framework, and to
[`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/),
which covers this repository's own maintainer workflow rather than
consumption of a published package.

## 2. Scope

### In scope

- `SKILL.md` — the skill: `lily-design-system-react-headless` package
  identity and install command, the React/JSX consumption idiom
  (`className`, rest-props spreading, `value`/`onChange` and
  `open`/`onChange` controlled patterns, callback naming, React
  attribute casing, documented component-level gotchas), theming and
  class hooks, and pointers to the naming/composition reference.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`),
  since it follows the `lily-design-system-*` naming convention and
  `bin/test` holds it to the same bar as the other implementation
  subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the React headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root
  files stay the single source of truth.
- Any component implementation. This skill does not ship JSX, tests,
  or any part of the `lily-design-system-react-headless` library
  itself — it only documents how to consume it.
- The React `*-picker` helper packages — that's
  `lily-design-system-react-helpers-skill`'s job.
- Framework-agnostic Lily concepts already covered by
  `lily-design-system-skill` (what "headless" means, what a class hook
  or slug is, the catalog at a glance) — this skill assumes that
  grounding and adds only the React-specific layer on top.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no
tests to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair
      that names concrete trigger phrases, per Claude Skill authoring
      practice.
- [x] Required subproject files present: `index.md`, `README.md`
      (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
      `.git-subtree-push`.
- [x] `SKILL.md`'s package name, install command, and JSX conventions
      are grounded in the real `lily-design-system-react-headless`
      subproject's `AGENTS.md`, `spec/index.md`, and `package.json`,
      not invented.
- [ ] The 14 special files present via `bin/sync-special-files`.
- [ ] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the
      first push to a standalone public repository has happened; not
      yet done as of 2026-09-04.

## 5. Related topics

- [`../../lily-design-system-react-headless/spec/index.md`](../../lily-design-system-react-headless/spec/index.md) —
  the React headless library's own specification; the ground truth
  this skill documents consumption of.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this subproject extends
  with a React-specific layer.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  original two-skill plan this subproject and
  `lily-design-system-react-helpers-skill` build on top of.
