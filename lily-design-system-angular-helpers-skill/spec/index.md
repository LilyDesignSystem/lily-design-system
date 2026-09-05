# Lily Design System™ — Angular Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` /
`lily-design-system-maintainer-skill`) this subproject extends with a
framework-specific pair.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume the
[`lily-design-system-angular-helpers`](../../lily-design-system-angular-helpers/)
catalog: six opinionated Angular packages
(`theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, `date-time-picker`) that each own one complete interaction
end to end — selection, DOM application, and (for most) persistence —
rather than being pure markup primitives like the headless catalog. It
covers package identity and install per helper, the shared
icon-button-opens-listbox contract for the four preference helpers vs.
`share-picker`'s disclosure vs. `date-time-picker`'s field+dialog shape,
and the Angular-specific idiom (standalone components, signal `model()`,
the `$any($event.target).value` template-cast convention). It is content
and documentation, not a component implementation — it ships no helpers of
its own.

Its sibling, [`lily-design-system-angular-headless-skill`](../../lily-design-system-angular-headless-skill/),
covers the Angular headless component library (the full 491-component
catalog) instead of the picker helper catalog. Both follow the
`lily-design-system-` naming convention established by
`lily-design-system-skill` and `lily-design-system-maintainer-skill`
(2026-08-31 rename) and get the same full-subproject treatment.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helpers' contracts, the two markup
  shapes, the Angular standalone-component/signal-`model()`/`OnPush`
  idiom, the `$any($event.target).value` template-cast convention, and
  SSR-safety/idempotent-apply notes.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since it
  follows the `lily-design-system-*` naming convention and `bin/test` holds
  it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/helpers.md` or the individual Angular helpers' own
  `spec/index.md` files in full — `SKILL.md` points at them so the root
  and subproject files stay the single source of truth.
- Any helper implementation.
- The Angular headless component library — that's
  `lily-design-system-angular-headless-skill`'s job.
- Framework-agnostic Lily concepts (the shared `*-picker` contract that
  applies across all seven catalogs, the headless-vs-example layers) —
  that's `lily-design-system-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` names all six helper packages and their individual
      contracts, plus the Angular-specific `$any($event.target).value`
      template-cast convention that is easy to get wrong by porting the
      cast idiom from another framework's docs.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [ ] The special files present via `bin/sync-special-files`.
- [ ] `bin/test` passes with this subproject in place.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done as
      of 2026-09-04.

## 5. Related topics

- [../../lily-design-system-angular-helpers/spec/index.md](../../lily-design-system-angular-helpers/spec/index.md) —
  the Angular helpers catalog this skill documents consumption of.
- [../../lily-design-system-angular-headless-skill/spec/index.md](../../lily-design-system-angular-headless-skill/spec/index.md) —
  the sibling skill for the Angular headless component library.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic Lily concepts skill this one specializes.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the two-skill plan this subproject extends with a framework-specific
  pair.
