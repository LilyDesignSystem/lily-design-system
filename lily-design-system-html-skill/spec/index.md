# Lily Design System™ — HTML Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
sixteen framework-specific skills plan this subproject extends with an
umbrella layer.

## 1. Role in the ecosystem

A Claude Skill that ties together the three real plain-HTML subprojects in
this monorepo — the full-catalog (491/491) headless component library
([`lily-design-system-html-headless`](../../lily-design-system-html-headless/)),
the six `*-picker` helper web components
([`lily-design-system-html-helpers`](../../lily-design-system-html-helpers/)),
and the styled NHS-UK-themed reference application
([`lily-design-system-html-css-js-examples`](../../lily-design-system-html-css-js-examples/))
— and helps an agent decide which one a request actually needs. It sits one
level above the two existing framework-specific skills for this family,
[`lily-design-system-html-headless-skill`](../../lily-design-system-html-headless-skill/)
and [`lily-design-system-html-helpers-skill`](../../lily-design-system-html-helpers-skill/),
which each cover exactly one of the three real subprojects in depth. It is
content and documentation, not a component implementation — it ships no
headless components, no example app, no helper packages of its own.

This is the umbrella counterpart, for the plain-HTML family, to the general
[`lily-design-system-skill`](../../lily-design-system-skill/). Its structural
sibling on the Web Components side is
[`lily-design-system-web-components-skill`](../../lily-design-system-web-components-skill/).

## 2. Scope

### In scope

- `SKILL.md` — the skill: a map of the three real HTML subprojects and when
  to reach for each, real coverage of the example application (required
  routes, NHS UK visual reference, composed-page demos, running it with no
  build step, the `bin/sync`-vendored helper `dist/index.js` files) since
  neither sibling skill covers it, the conventions that span all three
  (class-hook theming, vanilla JavaScript, no CSS framework, no hardcoded
  strings), and the HTML-vs-Web-Components distinction with a pointer to
  `lily-design-system-web-components-skill`.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*` naming
  convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `lily-design-system-html-headless-skill`'s or
  `lily-design-system-html-helpers-skill`'s own content in full — `SKILL.md`
  points at them so each sibling skill stays the single source of truth for
  its one subproject's deep contract.
- Restating `AGENTS/*.md` in full — pointers, not a duplicate.
- Any component implementation, helper implementation, or the example app's
  own page markup/CSS — this skill describes the example app's contract,
  it does not ship or reimplement it.
- The separate Web Components catalogs' own conventions and scope (native
  custom elements, a deliberately partial 33/491 headless slice) — that
  pair has its own umbrella skill, `lily-design-system-web-components-skill`,
  and its own `-headless-skill` / `-helpers-skill` siblings.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` maps all three real HTML subprojects and states when to
      reach for each, without restating either sibling skill's own
      contract in full.
- [x] `SKILL.md` gives the example application (`lily-design-system-html-css-js-examples`)
      real, verified coverage — required routes, NHS UK visual reference,
      composed pages, and the `bin/sync` helper-vendoring mechanism — since
      no other skill covers it.
- [x] `SKILL.md` distinguishes this plain-HTML family from the separate Web
      Components catalogs and points to their own skill.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-05.

## 5. Related topics

- [../../lily-design-system-html-headless-skill/spec/index.md](../../lily-design-system-html-headless-skill/spec/index.md) —
  the sibling skill covering the HTML headless library's own contract in
  depth.
- [../../lily-design-system-html-helpers-skill/spec/index.md](../../lily-design-system-html-helpers-skill/spec/index.md) —
  the sibling skill covering the HTML helpers catalog's own contract in
  depth.
- [../../lily-design-system-html-css-js-examples/spec/index.md](../../lily-design-system-html-css-js-examples/spec/index.md) —
  the example application's own specification; the canonical source this
  skill's example-app coverage points at rather than duplicates.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the general Lily concepts skill this subproject specialises for the
  plain-HTML family.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the sixteen framework-specific skills plan and naming convention this
  umbrella skill extends.
