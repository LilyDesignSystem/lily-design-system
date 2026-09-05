# Lily Design System™ — Svelte Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan the general skills implement — this subproject is a
framework-specific extension of that same idea, scoped to one framework
pair's helper catalog rather than the whole catalog.

## 1. Role in the ecosystem

A Claude Skill that explains the Svelte 5 `*-picker` helper catalog,
[`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/):
the six helpers (theme-picker, locale-picker, text-size-picker,
motion-picker, share-picker, date-time-picker), their npm package
identities and install idiom, the shared icon-button-opens-listbox
contract for the four preference helpers versus `share-picker`'s link
disclosure and `date-time-picker`'s field+dialog shape, and the
idempotent-apply rule. Per `AGENTS/helpers.md`'s "Svelte is canonical"
rule, this catalog is the reference contract every other framework's
helpers port from — this skill exists to make that contract legible to an
AI agent working in Svelte, not to duplicate it. It is content and
documentation, not a component implementation — it ships no headless
components, no example app, no helper packages.

Its sibling, [`lily-design-system-svelte-headless-skill`](../../lily-design-system-svelte-headless-skill/),
covers the plain headless catalog components, a different layer: a
headless component is a pure container, while a helper owns a whole
interaction end to end. Both are framework-specific extensions of the
same two-skill split that
[`lily-design-system-skill`](../../lily-design-system-skill/) and
[`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/)
established for the framework-agnostic and maintainer-facing content.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helpers and their one-line contracts,
  npm package names and install idiom (verified against the live npm
  registry), the shared icon-button-opens-listbox contract, the
  divergences (`share-picker`'s disclosure, `date-time-picker`'s
  field+dialog shape, `motion-picker`'s unconditional OS-preference
  default), the idempotent-apply rule and the real Svelte
  `effect_update_depth_exceeded` freeze it fixes, and pointers to
  `AGENTS/helpers.md` and `AGENTS/sveltekit.md` for the full contracts
  this skill does not restate.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since
  it follows the `lily-design-system-*` naming convention and `bin/test`
  holds it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Svelte helpers subproject's own
  `spec/index.md` (or any individual helper's own `spec/index.md`) in
  full — `SKILL.md` points at them so the root files and the Svelte
  helpers subproject's own specs stay the single source of truth.
- Any component implementation. Helper source, tests, stories, and
  per-helper docs live in
  [`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/)
  itself.
- The plain headless catalog — that's
  [`lily-design-system-svelte-headless-skill`](../../lily-design-system-svelte-headless-skill/)'s
  job.
- Framework-agnostic Lily concepts already covered by
  [`lily-design-system-skill`](../../lily-design-system-skill/).

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
- [x] `SKILL.md` states only facts verified against the real
      `lily-design-system-svelte-helpers` catalog and the live npm
      registry (per-helper publish status as of 2026-09-04: theme-picker,
      locale-picker, text-size-picker, share-picker, and date-time-picker
      published at 0.1.1; motion-picker not found on the registry) — no
      fabricated version numbers or test counts.
- [ ] The 14 special files present via `bin/sync-special-files`; not yet
      done as of 2026-09-04.
- [ ] `bin/test` passes with this subproject in place; not yet verified
      as of 2026-09-04.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [`lily-design-system-svelte-helpers`'s own spec/index.md](../../lily-design-system-svelte-helpers/spec/index.md) —
  the canonical helper catalog's own architecture, conventions, and
  per-helper contracts this skill points consumers at rather than
  duplicating.
- [`lily-design-system-svelte-headless-skill`'s spec/index.md](../../lily-design-system-svelte-headless-skill/spec/index.md) —
  the sibling skill for the plain headless catalog, a different layer.
- [`lily-design-system-skill`'s spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic concepts skill this subproject specialises for
  Svelte's helper layer.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  two-skill plan (consumer vs. maintainer) this subproject's split
  extends into a per-framework helper catalog.
