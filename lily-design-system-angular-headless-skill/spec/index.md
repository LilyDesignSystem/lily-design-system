# Lily Design System™ — Angular Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` /
`lily-design-system-maintainer-skill`) this subproject extends with a
framework-specific pair.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`lily-design-system-angular-headless`](../../lily-design-system-angular-headless/),
the Angular implementation of Lily's full 491-component headless catalog:
package identity and install, the Angular-specific standalone-component and
signal-input idiom, the element-selector convention, and — the one
genuinely Angular-specific wrinkle in the whole catalog — the
tag+attribute-selector convention that 51 list-item and table sub-element
components use instead of a plain custom element tag. It is content and
documentation, not a component implementation — it ships no components of
its own.

Its sibling, [`lily-design-system-angular-helpers-skill`](../../lily-design-system-angular-helpers-skill/),
covers the Angular `*-picker` helper catalog
(`lily-design-system-angular-helpers`) instead of the headless component
library. Both follow the `lily-design-system-` naming convention
established by `lily-design-system-skill` and
`lily-design-system-maintainer-skill` (2026-08-31 rename) and get the same
full-subproject treatment.

## 2. Scope

### In scope

- `SKILL.md` — the skill: package identity, install command, the Angular
  standalone-component/signal-input/`OnPush` idiom, the element-selector
  vs. tag+attribute-selector convention, theming/class hooks, and pointers
  to the catalog-wide naming and composition references.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since it
  follows the `lily-design-system-*` naming convention and `bin/test` holds
  it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Angular headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root and
  subproject files stay the single source of truth.
- Any component implementation.
- The Angular `*-picker` helper catalog — that's
  `lily-design-system-angular-helpers-skill`'s job.
- Framework-agnostic Lily concepts (the headless-vs-example layers, the
  catalog at a glance, picking a framework) — that's
  `lily-design-system-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` documents the tag+attribute-selector convention for the 51
      list-item/table sub-element components, since that's the one detail a
      consumer cannot infer from the catalog-wide (framework-agnostic)
      naming rules alone.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [ ] The special files present via `bin/sync-special-files`.
- [ ] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done as
      of 2026-09-04.

## 5. Related topics

- [../../lily-design-system-angular-headless/spec/index.md](../../lily-design-system-angular-headless/spec/index.md) —
  the Angular headless library this skill documents consumption of,
  including the full wrapper-host tag+attribute-selector defect record.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this one specializes.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the two-skill plan this subproject extends with a framework-specific
  pair.
