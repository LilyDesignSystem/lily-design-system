# Lily Design System™ — Blazor Helpers Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan this subproject extends with a framework-scoped skill.

## 1. Role in the ecosystem

A Claude Skill that explains how to install and use
[`lily-design-system-blazor-helpers`](../../lily-design-system-blazor-helpers/):
the six `*-picker` helper packages (theme-picker, locale-picker,
text-size-picker, motion-picker, share-picker, date-time-picker), their NuGet
package identities and publish status, the shared icon-button-plus-listbox
contract and its two deliberate exceptions, and the Blazor-specific
implementation pattern (partial-class `.razor`/`.razor.cs` pairs, `IJSRuntime`
interop gated on `OnAfterRenderAsync`, safety across all four Blazor hosting
models). It is content and documentation, not a component implementation — it
ships no Razor components, no tests beyond its own required-files check.

Its siblings:

- [`lily-design-system-skill`](../../lily-design-system-skill/) covers
  framework-agnostic Lily concepts (headless-vs-example, the catalog,
  naming conventions, composition patterns).
- [`lily-design-system-blazor-headless-skill`](../../lily-design-system-blazor-headless-skill/)
  covers the Blazor headless component catalog — the lower-level library of
  pure markup primitives these helpers sit alongside, not covered here.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the six helpers' contracts, NuGet package
  identities and publish status, the shared listbox contract and its two
  exceptions (`share-picker`'s disclosure, `date-time-picker`'s
  field-plus-dialog shape), and the Blazor-specific `IJSRuntime`/SSR pattern.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since it
  follows the `lily-design-system-*` naming convention and `bin/test` holds
  it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/helpers.md` or the Blazor helpers catalog's own
  `spec/index.md` in full — `SKILL.md` points at them so those files stay
  the single source of truth.
- Any component implementation. This skill teaches consumption of
  `lily-design-system-blazor-helpers`; it does not ship, modify, or test
  that catalog's `.razor`/`.razor.cs` components.
- The Blazor headless component catalog — that's
  `lily-design-system-blazor-headless-skill`'s job.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests to
run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [x] Every concrete fact in `SKILL.md` (package ids, publish status, the
      `IJSRuntime`/`OnAfterRenderAsync` pattern) is grounded in the Blazor
      helpers catalog's own `AGENTS.md`/`index.md`/`.csproj` files and the
      root `AGENTS/helpers.md` and `CHANGELOG.md`, not invented — including
      naming `motion-picker`'s NuGet publish status as unconfirmed rather
      than assuming parity with its five siblings, since it landed in the
      catalog after the 2026-09-02 real-publish run this spec's sources
      record.
- [ ] A `.git-subtree-push` remote is actually configured and the first push
      to a standalone public repository has happened; not yet done as of
      2026-09-04.

## 5. Related topics

- [`../../lily-design-system-blazor-helpers/spec/index.md`](../../lily-design-system-blazor-helpers/spec/index.md) —
  the Blazor helpers catalog's own spec: the source of truth for every
  per-helper fact this skill teaches. (Note: as read on 2026-09-04, that
  file itself only lists `theme-picker` and `locale-picker`, trailing the
  catalog's actual six-helper `AGENTS.md`/`index.md` state — this skill's
  `SKILL.md` is grounded in the more current `AGENTS.md`/`index.md`/`.csproj`
  facts, not the stale spec enumeration.)
- [`../../lily-design-system-blazor-headless-skill/spec/index.md`](../../lily-design-system-blazor-headless-skill/spec/index.md) —
  the sibling skill for the lower-level headless component catalog these
  helpers sit alongside.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic consumer skill this subproject narrows to Blazor.
- [`../../spec/agent-skills/index.md`](../../spec/agent-skills/index.md) —
  the two-skill (consumer/maintainer) plan this and the Blazor headless
  skill extend with framework-scoped skills.
