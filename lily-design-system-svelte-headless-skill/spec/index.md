# Lily Design System™ — Svelte Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan the general skills implement — this subproject is a
framework-specific extension of that same idea, scoped to one framework
pair rather than the whole catalog.

## 1. Role in the ecosystem

A Claude Skill that explains how to install and consume the Svelte 5
implementation of Lily Design System's headless component catalog,
[`lily-design-system-svelte-headless`](../../lily-design-system-svelte-headless/):
the npm package identity, the Svelte 5 runes-specific consumption idiom
(the `class` prop, `$props()` with rest-props spread onto the root
element, `$bindable()` for open/close state), and where the catalog-wide
naming and composition rules live. It is content and documentation, not a
component implementation — it ships no headless components, no example
app, no helper packages.

Its sibling, [`lily-design-system-svelte-helpers-skill`](../../lily-design-system-svelte-helpers-skill/),
covers the Svelte `*-picker` helper catalog — a different layer that owns
a whole interaction (theme, locale, text-size, motion, share, date/time),
not a plain catalog component. Both are framework-specific extensions of
the same two-skill split that
[`lily-design-system-skill`](../../lily-design-system-skill/) and
[`lily-design-system-maintainer-skill`](../../lily-design-system-maintainer-skill/)
established for the framework-agnostic and maintainer-facing content.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the npm package name and install command, the
  Svelte 5 consumption idiom (`class` prop, `$props()`/rest-props,
  `$bindable()`, `Snippet` children), theming/class-hook behaviour, and
  pointers to `AGENTS/components.md` and `AGENTS/sveltekit.md` for the
  catalog-wide and Svelte-wide rules this skill does not restate.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since
  it follows the `lily-design-system-*` naming convention and `bin/test`
  holds it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Svelte headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root files
  and the Svelte headless subproject's own spec stay the single source
  of truth.
- Any component implementation. Component source, tests, stories, and
  per-component docs live in
  [`lily-design-system-svelte-headless`](../../lily-design-system-svelte-headless/)
  itself.
- The Svelte `*-picker` helper catalog — that's
  [`lily-design-system-svelte-helpers-skill`](../../lily-design-system-svelte-helpers-skill/)'s
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
      `lily-design-system-svelte-headless` subproject (package name,
      npm publish status, Svelte 5 idiom) — no fabricated version
      numbers or test counts.
- [ ] The 14 special files present via `bin/sync-special-files`; not yet
      done as of 2026-09-04.
- [ ] `bin/test` passes with this subproject in place; not yet verified
      as of 2026-09-04.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [`lily-design-system-svelte-headless`'s own spec/index.md](../../lily-design-system-svelte-headless/spec/index.md) —
  the Svelte 5 architecture, file conventions, and implementation status
  this skill points consumers at rather than duplicating.
- [`lily-design-system-skill`'s spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic concepts skill this subproject specialises for
  Svelte.
- [spec/agent-skills/index.md](../../spec/agent-skills/index.md) — the
  two-skill plan (consumer vs. maintainer) this subproject's split
  extends into a per-framework pair.
