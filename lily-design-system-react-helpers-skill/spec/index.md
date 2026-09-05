# Lily Design System™ — React Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` and
`lily-design-system-maintainer-skill`) this subproject extends with a
React-specific pair.

## 1. Role in the ecosystem

A Claude Skill that explains how to install and use the React
implementation of Lily Design System™'s six `*-picker` helper
packages — `theme-picker`, `locale-picker`, `text-size-picker`,
`motion-picker`, `share-picker`, and `date-time-picker` — each its own
npm package under `lily-design-system-react-helpers`. It covers their
package names, the three root shapes (icon-button-plus-listbox,
disclosure-of-links, field-plus-dialog), the React-specific
consumption idiom, and the idempotent-apply guard's React-specific
relevance. It is content and documentation, not a component
implementation — it ships no headless components, no example app, no
helper packages.

Its sibling, [`lily-design-system-react-headless-skill`](../../lily-design-system-react-headless-skill/),
covers the React headless component catalog instead of the helper
packages. Both are narrower, framework-scoped counterparts to
[`lily-design-system-skill`](../../lily-design-system-skill/), which
explains Lily concepts independent of any one framework, and to
[`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/),
which covers this repository's own maintainer workflow rather than
consumption of a published package.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helper packages' names and one-line
  contracts, the three root markup shapes, the React consumption
  idiom (controlled `value`/`onChange`, render-prop `children`,
  `"use client"` SSR boundaries), and the idempotent-apply guard's
  React-specific rationale (a controlled value applies once when set
  and again when the consumer's own `onChange` writes it back).
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`),
  since it follows the `lily-design-system-*` naming convention and
  `bin/test` holds it to the same bar as the other implementation
  subprojects.

### Explicitly out of scope

- Restating `AGENTS/helpers.md` or any individual helper's own
  `spec/index.md` in full — `SKILL.md` points at them so the root
  files stay the single source of truth.
- Any component or helper implementation. This skill does not ship
  any part of the `lily-design-system-react-helpers` packages
  themselves — it only documents how to consume them.
- The React headless component catalog — that's
  `lily-design-system-react-headless-skill`'s job.
- Framework-agnostic Lily concepts already covered by
  `lily-design-system-skill` (what a helper is versus a plain catalog
  component, the shared glyph conventions, the general picker
  contract) — this skill assumes that grounding and adds only the
  React-specific layer on top.

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
- [x] `SKILL.md`'s six package names, root markup shapes, and the
      idempotent-apply description are grounded in the real
      `lily-design-system-react-helpers` subproject's `AGENTS.md`,
      `index.md`, and the root `AGENTS/helpers.md` contract, not
      invented.
- [ ] The 14 special files present via `bin/sync-special-files`.
- [ ] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the
      first push to a standalone public repository has happened; not
      yet done as of 2026-09-04.

## 5. Related topics

- [`../../lily-design-system-react-helpers/spec/index.md`](../../lily-design-system-react-helpers/spec/index.md) —
  the React helpers catalog's own specification; the ground truth
  this skill documents consumption of.
- [`../../lily-design-system-react-headless-skill/spec/index.md`](../../lily-design-system-react-headless-skill/spec/index.md) —
  the sibling React skill covering the headless component catalog
  instead of the helper packages.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this subproject extends
  with a React-specific layer.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  original two-skill plan this subproject and
  `lily-design-system-react-headless-skill` build on top of.
