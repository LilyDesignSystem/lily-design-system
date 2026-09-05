# Lily Design System™ — Blazor Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
framework-scoped-skills plan this subproject sits at the top of, for
Blazor.

## 1. Role in the ecosystem

A Claude Skill that ties together the three real Blazor subprojects in
this monorepo — [`lily-design-system-blazor-headless`](../../lily-design-system-blazor-headless/),
[`lily-design-system-blazor-helpers`](../../lily-design-system-blazor-helpers/),
and [`lily-design-system-blazor-web-examples`](../../lily-design-system-blazor-web-examples/) —
helps an agent decide which one it needs, and points into the two more
specific sibling skills
([`lily-design-system-blazor-headless-skill`](../../lily-design-system-blazor-headless-skill/),
[`lily-design-system-blazor-helpers-skill`](../../lily-design-system-blazor-helpers-skill/))
rather than duplicating their content. It sits one level up from those two:
an **umbrella** skill for the whole Blazor framework family, not a
deep-dive on any one subproject's contract. The one exception is the
example app, which neither sibling skill covers — this skill gives it real,
direct coverage since nothing else in the framework-skill layer does. It is
content and documentation, not a component implementation — it ships no
Razor components, no example pages, no tests beyond its own required-files
check.

Its position relative to its siblings:

- [`lily-design-system-skill`](../../lily-design-system-skill/) covers
  framework-agnostic Lily concepts (headless-vs-example, the catalog,
  naming conventions, composition patterns) — this skill narrows that to
  "which Blazor subproject" rather than restating the concepts themselves.
- [`lily-design-system-blazor-headless-skill`](../../lily-design-system-blazor-headless-skill/)
  and [`lily-design-system-blazor-helpers-skill`](../../lily-design-system-blazor-helpers-skill/)
  each cover exactly one of the three real subprojects in depth; this
  skill sits above both, routes to them, and does not restate their
  content.

## 2. Scope

### In scope

- `SKILL.md` — the skill: a short map of the three real Blazor subprojects
  (what each is, when to reach for it), pointers to the two sibling skills
  for their deep-dive contracts, full coverage of the example app (routes,
  NHS UK visual reference, how to run it, the Interactive Server hosting
  model, the native-attribute-vs-PascalCase-parameter gotcha that broke
  five of its own pages), and the Blazor-wide conventions verified to span
  all three subprojects (.NET 10/C#, the namespace split, `CssClass`,
  `RenderFragment ChildContent`, `AdditionalAttributes`, `IJSRuntime` DOM
  work, NuGet Trusted Publishing).
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`), since it
  follows the `lily-design-system-*` naming convention and `bin/test` holds
  it to the same bar as the other implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-blazor-headless-skill`'s or
  `lily-design-system-blazor-helpers-skill`'s content in full — `SKILL.md`
  points at them so those skills stay the single source of truth for the
  headless library's parameter idioms and the helpers' shared contract.
- Restating `AGENTS/*.md` or any of the three real subprojects' own
  `spec/index.md`/`AGENTS.md` in full.
- Any component implementation, helper package, or examples-app page —
  this subproject ships none of the three real Blazor subprojects'
  content, only a map of and pointer into them.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [x] Every concrete fact in `SKILL.md` about the three real Blazor
      subprojects (package identities, namespaces, the example app's
      routes, hosting model, and native-attribute gotcha) is grounded in
      those subprojects' own `AGENTS.md`/`index.md` files, not invented.
- [x] `SKILL.md` does not restate `lily-design-system-blazor-headless-skill`'s
      or `lily-design-system-blazor-helpers-skill`'s content — it points at
      them.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done as
      of 2026-09-05.

## 5. Related topics

- [`../../lily-design-system-blazor-headless-skill/spec/index.md`](../../lily-design-system-blazor-headless-skill/spec/index.md) —
  the deep-dive skill for the Blazor headless component library this
  subproject points to rather than restates.
- [`../../lily-design-system-blazor-helpers-skill/spec/index.md`](../../lily-design-system-blazor-helpers-skill/spec/index.md) —
  the deep-dive skill for the Blazor `*-picker` helpers catalog this
  subproject points to rather than restates.
- [`../../lily-design-system-blazor-web-examples/index.md`](../../lily-design-system-blazor-web-examples/index.md) —
  the example app this subproject gives its only skill-level coverage to;
  that subproject does not yet have its own `spec/index.md`.
- [`../../lily-design-system-skill/spec/index.md`](../../lily-design-system-skill/spec/index.md) —
  the framework-agnostic consumer skill this subproject narrows to "which
  Blazor subproject."
- [`../../spec/agent-skills/index.md`](../../spec/agent-skills/index.md) —
  the eighteen-skill plan (two general + sixteen framework-specific) this
  subproject's siblings extend, and that this umbrella skill sits above
  for the Blazor family.
