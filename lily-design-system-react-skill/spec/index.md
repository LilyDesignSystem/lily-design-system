# Lily Design System™ — React Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
framework-specific skills plan this subproject sits at the top of.

## 1. Role in the ecosystem

A Claude Skill that acts as the **umbrella** for React in Lily Design
System™: it ties together the three real React subprojects —
[`lily-design-system-react-headless`](../../lily-design-system-react-headless/),
[`lily-design-system-react-helpers`](../../lily-design-system-react-helpers/),
and
[`lily-design-system-react-next-examples`](../../lily-design-system-react-next-examples/) —
helps an agent decide which one it needs, and points into the two more
specific sibling skills
([`lily-design-system-react-headless-skill`](../../lily-design-system-react-headless-skill/),
[`lily-design-system-react-helpers-skill`](../../lily-design-system-react-helpers-skill/))
rather than duplicating their content. It sits one level up from those
two, and one level below the framework-agnostic
[`lily-design-system-skill`](../../lily-design-system-skill/). It is
content and documentation, not a component implementation — it ships
no headless components, no example app, no helper packages.

The example app,
[`lily-design-system-react-next-examples`](../../lily-design-system-react-next-examples/),
has no dedicated sibling skill of its own, so this umbrella skill gives
it real, first-hand coverage (routes, NHS UK visual reference, App
Router / `"use client"` boundaries, how to run it) rather than a bare
pointer.

## 2. Scope

### In scope

- `SKILL.md` — the skill: a map of the three real React subprojects
  and when to reach for each, pointers to the two sibling skills for
  the headless library and the helpers catalog, real coverage of the
  Next.js example app (routes, styling, running it, App Router
  specifics), and the React-wide conventions verified across all
  three (function components + hooks only, `className`, rest-props
  spreading, `"use client"` boundaries, no hardcoded strings).
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`),
  since it follows the `lily-design-system-*` naming convention and
  `bin/test` holds it to the same bar as the other implementation
  subprojects.

### Explicitly out of scope

- Restating
  [`lily-design-system-react-headless-skill`](../../lily-design-system-react-headless-skill/)'s
  or
  [`lily-design-system-react-helpers-skill`](../../lily-design-system-react-helpers-skill/)'s
  content in full — install commands, import shapes, controlled-prop
  patterns, and component-level gotchas live there; this skill only
  routes to them.
- Restating `AGENTS/*.md` or any of the three subprojects' own
  `spec/index.md` files in full.
- Any component, helper, or example-page implementation. This skill
  does not ship any part of
  `lily-design-system-react-headless`,
  `lily-design-system-react-helpers`, or
  `lily-design-system-react-next-examples` themselves — it only
  documents how to choose between them and, for the example app, how
  to use it.
- Framework-agnostic Lily concepts already covered by
  [`lily-design-system-skill`](../../lily-design-system-skill/) (what
  "headless" means, what a class hook or slug is, the catalog at a
  glance, naming and composition patterns not specific to React) —
  this skill assumes that grounding.

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
- [x] `SKILL.md`'s three-subproject map, the example-app coverage
      (routes, styling, running it, App Router specifics), and the
      React-wide conventions are grounded in the real
      `lily-design-system-react-headless`,
      `lily-design-system-react-helpers`, and
      `lily-design-system-react-next-examples` subprojects' own
      `AGENTS.md` and `index.md` files, not invented.
- [x] `SKILL.md` explicitly defers to
      `lily-design-system-react-headless-skill` and
      `lily-design-system-react-helpers-skill` rather than restating
      their content.
- [ ] The 14 special files present via `bin/sync-special-files`.
- [ ] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the
      first push to a standalone public repository has happened; not
      yet done as of 2026-09-05.

## 5. Related topics

- [`../../lily-design-system-react-headless-skill/spec/index.md`](../../lily-design-system-react-headless-skill/spec/index.md) —
  the sibling skill covering the React headless component library in
  depth.
- [`../../lily-design-system-react-helpers-skill/spec/index.md`](../../lily-design-system-react-helpers-skill/spec/index.md) —
  the sibling skill covering the six React `*-picker` helper packages
  in depth.
- [`../../lily-design-system-react-next-examples/spec/index.md`](../../lily-design-system-react-next-examples/spec/index.md) —
  the Next.js example app's own specification; the ground truth this
  skill's example-app section documents.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this subproject assumes
  as prior grounding.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  framework-specific skills plan this subproject sits at the top of,
  one level above its two React siblings.
