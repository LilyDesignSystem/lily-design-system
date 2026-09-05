# Lily Design System™ — Angular Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
eighteen-skill plan (two general skills plus sixteen framework-specific
ones) this subproject is one half of the Angular pair for.

## 1. Role in the ecosystem

A Claude Skill that ties together the three real Angular subprojects in
this monorepo — the headless component library
[`lily-design-system-angular-headless`](../../lily-design-system-angular-headless/),
the `*-picker` helpers catalog
[`lily-design-system-angular-helpers`](../../lily-design-system-angular-helpers/),
and the styled example application
[`lily-design-system-angular-examples`](../../lily-design-system-angular-examples/)
— and helps an agent decide which one it needs. It is content and
documentation, not a component implementation — it ships no components,
helpers, or example pages of its own.

Unlike its two siblings, it does not deep-dive one subproject's own
consumption contract. It is an **umbrella**, one level up from
[`lily-design-system-angular-headless-skill`](../../lily-design-system-angular-headless-skill/)
and
[`lily-design-system-angular-helpers-skill`](../../lily-design-system-angular-helpers-skill/):
it maps all three real subprojects, points into those two skills for the
headless library's and helpers catalog's own deep-dive contracts rather
than duplicating them, and gives real coverage of the one subproject
neither sibling skill documents — the example app (its required routes,
the NHS UK visual reference, composed-page demos, and how to run it). All
three skills follow the `lily-design-system-` naming convention
established by `lily-design-system-skill` and
`lily-design-system-maintainer-skill` (2026-08-31 rename) and get the same
full-subproject treatment.

## 2. Scope

### In scope

- `SKILL.md` — the skill: a map of the three real Angular subprojects and
  when to reach for each, real coverage of the example app (routes,
  styling/NHS UK reference, how to run it), pointers to the two sibling
  skills for their own deep-dive contracts, the Angular-wide conventions
  verified across all three (standalone components, signal inputs,
  `OnPush`, no CSS framework dependency), and a pointer to
  `lily-design-system-skill` for framework-agnostic Lily concepts.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since it
  follows the `lily-design-system-*` naming convention and `bin/test` holds
  it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-angular-headless-skill`'s own content
  (install command, the standalone-component/signal-input idiom, the
  tag+attribute-selector convention for the 51 list-item/table
  sub-element components) — this skill points at that sibling skill
  instead.
- Restating `lily-design-system-angular-helpers-skill`'s own content (the
  six helper packages' contracts, the two markup shapes, the
  `$any($event.target).value` template-cast idiom) — this skill points at
  that sibling skill instead.
- Restating `AGENTS/*.md` in full — `SKILL.md` points at the root files so
  they stay the single source of truth.
- Any component, helper, or example-page implementation.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` maps all three real Angular subprojects and states when to
      reach for each, without restating either sibling skill's own
      deep-dive contract.
- [x] `SKILL.md` gives real, grounded coverage of the example app's
      required routes, composed-page demos, NHS UK visual reference, and
      how to run it — the one Angular subproject neither sibling skill
      documents.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [ ] The special files present via `bin/sync-special-files`.
- [ ] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done as
      of 2026-09-05.

## 5. Related topics

- [../../lily-design-system-angular-headless-skill/spec/index.md](../../lily-design-system-angular-headless-skill/spec/index.md) —
  the sibling skill for the Angular headless component library's own
  consumption contract.
- [../../lily-design-system-angular-helpers-skill/spec/index.md](../../lily-design-system-angular-helpers-skill/spec/index.md) —
  the sibling skill for the Angular `*-picker` helpers catalog's own
  consumption contract.
- [../../lily-design-system-angular-examples/spec/index.md](../../lily-design-system-angular-examples/spec/index.md) —
  the Angular example application this skill gives real coverage of,
  since neither sibling skill documents it.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this one specializes for
  Angular.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the full eighteen-skill plan this subproject is part of.
