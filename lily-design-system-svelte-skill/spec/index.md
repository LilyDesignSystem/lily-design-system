# Lily Design System™ — Svelte Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
agent-skills plan this subproject is part of.

## 1. Role in the ecosystem

An **umbrella Claude Skill** for Svelte: it ties together the three real
Svelte subprojects in this monorepo — the headless component library
([`lily-design-system-svelte-headless`](../../lily-design-system-svelte-headless/)),
the `*-picker` helpers catalog
([`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/),
which is also the **canonical** reference every other framework's helpers
port from, per `AGENTS/helpers.md`'s "Svelte is canonical" rule), and the
SvelteKit example application
([`lily-design-system-svelte-sveltekit-examples`](../../lily-design-system-svelte-sveltekit-examples/))
— helps an agent decide which one it needs, and points into the two more
specific sibling skills that already cover the headless library and the
helpers catalog:
[`lily-design-system-svelte-headless-skill`](../../lily-design-system-svelte-headless-skill/)
and
[`lily-design-system-svelte-helpers-skill`](../../lily-design-system-svelte-helpers-skill/).
It sits one level up from those two, the same relationship
[`lily-design-system-skill`](../../lily-design-system-skill/) has to the
whole framework-specific skill set, scoped to one framework family. It is
content and documentation, not a component implementation — it ships no
headless components, no example app, no helper packages.

The canonical-helpers relevance matters for this skill specifically:
because Svelte's helpers catalog is the contract every other framework
ports from, a task that touches the *design* of a picker helper (not just
its Svelte consumption) is more likely to land here or in
`lily-design-system-svelte-helpers-skill` than in any other framework's
helpers skill.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the three-subproject map (headless library,
  canonical helpers catalog, SvelteKit example app), a decision aid for
  which subproject a task needs, pointers to the two sibling skills for
  the headless and helpers deep dives, real coverage of the SvelteKit
  example app (required routes, NHS UK visual reference, how to run it,
  its `axe-catalog.spec.ts` and `visual-regression.spec.ts` suites), and
  the Svelte-wide conventions verified to span all three subprojects
  (Svelte 5 runes, no `<style>` blocks outside the example app, vitest
  with built-in matchers only, no bundled i18n library).
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since
  it follows the `lily-design-system-*` naming convention and `bin/test`
  holds it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-svelte-headless-skill`'s or
  `lily-design-system-svelte-helpers-skill`'s content — this skill points
  at them so their own `SKILL.md` and `spec/index.md` stay the single
  source of truth for the headless consumption idiom and the per-helper
  contracts respectively.
- Restating `AGENTS/*.md` in full — `SKILL.md` points at the loaded
  `AGENTS/*.md` files rather than duplicating their rules.
- Any component, helper, or example-app implementation. Component source
  lives in `lily-design-system-svelte-headless`, helper source in
  `lily-design-system-svelte-helpers`, and example pages in
  `lily-design-system-svelte-sveltekit-examples` — none of it here.
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
      `lily-design-system-svelte-headless`, `lily-design-system-svelte-helpers`,
      and `lily-design-system-svelte-sveltekit-examples` subprojects (the
      SvelteKit example app's required + composed routes, its
      `e2e/axe-catalog.spec.ts` and `e2e/visual-regression.spec.ts` files,
      the Svelte-wide conventions) — no fabricated version numbers or test
      counts.
- [x] `SKILL.md` does not restate the two sibling skills' content — it
      points at them.
- [ ] The 14 special files present via `bin/sync-special-files`; not yet
      done as of 2026-09-05.
- [ ] `bin/test` passes with this subproject in place; not yet verified
      as of 2026-09-05.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-05.

## 5. Related topics

- [`lily-design-system-svelte-headless-skill`'s spec/index.md](../../lily-design-system-svelte-headless-skill/spec/index.md) —
  the sibling skill covering the headless library's npm package identity
  and Svelte 5 consumption idiom in depth.
- [`lily-design-system-svelte-helpers-skill`'s spec/index.md](../../lily-design-system-svelte-helpers-skill/spec/index.md) —
  the sibling skill covering the canonical `*-picker` helpers catalog's
  six contracts and the idempotent-apply rule in depth.
- [`lily-design-system-svelte-sveltekit-examples`'s spec/index.md](../../lily-design-system-svelte-sveltekit-examples/spec/index.md) —
  the example application's own spec, for the one subproject this skill
  covers directly rather than through a sibling.
- [`lily-design-system-skill`'s spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic concepts skill this subproject specialises for
  Svelte as a whole.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  full agent-skills plan, including the sixteen framework-specific skills
  this subproject's umbrella role sits above.
