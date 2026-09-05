# Lily Design System™ — Nunjucks Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan `lily-design-system-skill` and
`lily-design-system-maintainer-skill` implement — this subproject and its
sibling `lily-design-system-nunjucks-helpers-skill` extend that plan with
a framework-scoped pair.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`lily-design-system-nunjucks-headless`](../../lily-design-system-nunjucks-headless/):
the macro-call idiom (a single `params` object, the shared `text` / `html`
/ `label` / `classes` / `attributes` keys), the camelCase-macro versus
kebab-case-file/class naming split Nunjucks' own identifier syntax forces,
composing nested components via `{% call %}` blocks and `caller()`, and
notes specific to a library with no bundled client runtime. It is content
and documentation, not a component implementation — it ships no macros,
no example app, no helper packages.

Its sibling, [`lily-design-system-nunjucks-helpers-skill`](../../lily-design-system-nunjucks-helpers-skill/),
covers the Nunjucks `*-picker` helpers catalog instead — a different
package with its own macro-plus-`client.js` split. The framework-agnostic
[`lily-design-system-skill`](../../lily-design-system-skill/) covers Lily
concepts that apply across all seven frameworks and is this subproject's
first stop for anything not specific to Nunjucks.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the macro-call idiom, the naming split, `{%
  call %}`/`caller()` composition, theming via class hooks, and
  server-rendering notes for this specific catalog.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Nunjucks headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root and
  subproject files stay the single source of truth.
- Any component implementation, example page, or helper package.
- The `*-picker` helpers catalog — that's
  `lily-design-system-nunjucks-helpers-skill`'s job.
- Maintainer-facing tooling and workflow content for the monorepo as a
  whole — that's `lily-design-system-maintainer-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no
tests to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `SKILL.md` content is grounded in the real Nunjucks headless
      subproject's `AGENTS.md` / `spec/index.md` / `index.md` — no
      invented version numbers, test counts, or macro conventions.
- [ ] The 14 special files present via `bin/sync-special-files`; not yet
      done as of 2026-09-04.
- [ ] `bin/test` passes with this subproject in place; not yet verified
      as of 2026-09-04.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [`lily-design-system-nunjucks-headless`'s spec/index.md](../../lily-design-system-nunjucks-headless/spec/index.md) —
  the subproject this skill teaches consumers to use; the source of
  truth for the macro catalog itself, its file layout, and its test
  suite.
- [`lily-design-system-skill`'s spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic sibling this subproject defers to for Lily-wide
  concepts, terminology, and composition patterns.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  two-skill (consumer / maintainer) plan this subproject's naming
  convention and full-subproject treatment follow.
