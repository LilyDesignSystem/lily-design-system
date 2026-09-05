# Lily Design System™ — Nunjucks Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
plan `lily-design-system-skill` and `lily-design-system-maintainer-skill`
implement, and the sixteen framework-specific skills — this subproject
among them — extend.

## 1. Role in the ecosystem

A Claude Skill that acts as the **umbrella** for Nunjucks in Lily Design
System: it ties together the three real Nunjucks subprojects —
[`lily-design-system-nunjucks-headless`](../../lily-design-system-nunjucks-headless/),
[`lily-design-system-nunjucks-helpers`](../../lily-design-system-nunjucks-helpers/),
and
[`lily-design-system-nunjucks-eleventy-examples`](../../lily-design-system-nunjucks-eleventy-examples/) —
helps an agent decide which one a task needs, and points into the two
more specific sibling skills
([`lily-design-system-nunjucks-headless-skill`](../../lily-design-system-nunjucks-headless-skill/),
[`lily-design-system-nunjucks-helpers-skill`](../../lily-design-system-nunjucks-helpers-skill/))
for their deep contracts rather than duplicating them. It sits one level
up from those two: where they each cover exactly one real subproject in
depth, this subproject covers the relationship between all three and
gives the one subproject neither sibling documents — the Eleventy example
app — its own real coverage. It is content and documentation, not a
component implementation — it ships no macros, no client.js modules, no
example pages.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the three-subproject map (headless / helpers /
  example app), guidance on which one a task needs, pointers to the two
  deeper sibling skills, real coverage of the Eleventy example app
  (required routes, the NHS UK visual reference, composed-page demos, how
  to run it, and its `FileSystemLoader` integration with the headless
  library), and the Nunjucks-wide conventions verified across all three
  subprojects (camelCase macro names, kebab-case file paths and CSS
  classes, a single options object per macro, `data-lily-*` wiring hooks
  in the helpers catalog, and the `lily-design-system-nunjucks-*` package
  naming convention).
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*`
  naming convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-nunjucks-headless-skill`'s or
  `lily-design-system-nunjucks-helpers-skill`'s content in full —
  `SKILL.md` points at them so their own files stay the single source of
  truth for the macro-call idiom and the six picker contracts
  respectively.
- Restating `AGENTS/*.md` in full — `SKILL.md` points at the relevant
  files rather than reproducing them.
- Any component implementation, helper package implementation, or example
  page — those belong to the three real subprojects this skill maps, not
  to this skill itself.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair
      that names concrete trigger phrases, per Claude Skill authoring
      practice.
- [x] Required subproject files present: `index.md`, `README.md`
      (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`,
      `.git-subtree-push`.
- [x] `SKILL.md` maps all three real Nunjucks subprojects and states,
      for each, when an agent should reach for it.
- [x] `SKILL.md` points to both sibling skills rather than restating
      their content.
- [x] `SKILL.md` content on the Eleventy example app (routes, NHS UK
      visual reference, composed-page demos, run commands, the
      `FileSystemLoader` integration with the headless library) is
      grounded in that subproject's own `AGENTS.md` / `index.md` /
      `spec/index.md` — no invented version numbers, test counts, or
      route shapes.
- [ ] The special files present via `bin/sync-special-files`; not yet
      done as of 2026-09-05.
- [ ] `bin/test` passes with this subproject in place; not yet verified
      as of 2026-09-05.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-05.

## 5. Related topics

- [`lily-design-system-nunjucks-headless-skill`'s spec/index.md](../../lily-design-system-nunjucks-headless-skill/spec/index.md) —
  the sibling skill covering the headless macro-call idiom in depth; this
  subproject defers to it rather than restating it.
- [`lily-design-system-nunjucks-helpers-skill`'s spec/index.md](../../lily-design-system-nunjucks-helpers-skill/spec/index.md) —
  the sibling skill covering the six `*-picker` helper packages in depth;
  this subproject defers to it rather than restating it.
- [`lily-design-system-nunjucks-eleventy-examples`'s spec/index.md](../../lily-design-system-nunjucks-eleventy-examples/spec/index.md) —
  the source of truth for the one subproject this skill covers directly:
  its required routes, composed-page demos, and Eleventy-specific
  integration detail.
- [`lily-design-system-skill`'s spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic sibling this subproject defers to for Lily-wide
  concepts, terminology, and composition patterns that apply across all
  seven frameworks.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  full agent-skills plan, including the sixteen framework-specific
  skills' naming convention and the "two skills only" decision this
  umbrella-plus-pair shape for each framework family reversed.
