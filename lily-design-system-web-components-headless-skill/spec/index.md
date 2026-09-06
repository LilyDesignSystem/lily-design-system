# Lily Design System™ — Web Components Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` and
`lily-design-system-maintainer-skill`) this subproject builds on top of.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`lily-design-system-web-components-headless`](../../lily-design-system-web-components-headless/):
an 8th headless catalog, added 2026-09-03, alongside the seven canonical,
full-catalog (491/491) headless libraries (HTML, Svelte, React, Vue,
Angular, Blazor, Nunjucks). **This catalog, and therefore this skill, is
its full achievable scope: 456 of the 491 canonical components as of 2026-09-06, spanning every
major category, proving that native custom elements can deliver a real
Lily component (headless, semantic, ARIA-correct, keyboard-operable) with
no framework runtime — not a claim of parity with the seven full-catalog
libraries.** Every statement this skill makes about coverage is scoped to
those 456; it must never imply the remaining 35 will ever be added. It is
content and documentation, not a component implementation — it ships no
headless components, no example app, no helper packages of its own.

This is the framework-specific counterpart, for the Web Components headless
library, to the general [`lily-design-system-skill`](../../lily-design-system-skill/).
Its sibling, [`lily-design-system-web-components-helpers-skill`](../../lily-design-system-web-components-helpers-skill/),
covers the neighbouring, separately maintained `*-picker` helpers catalog
(`lily-design-system-web-components-helpers`) instead of the headless
library.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the catalog's scope and exact component
  list (456 of 491 — its full achievable scope, spanning every category
  in the canonical catalog), the two architecture decisions made before
  any component was written (autonomous custom elements over customized
  built-ins, light-DOM-only), the two structural patterns components use
  (wrap a real native element; self-is-the-wrapper) plus the "upgrade in
  place" pattern (piloted on breadcrumb, extended to 14 more components),
  what's permanently excluded and why (every interactive `*ListItem`
  family and every table sub-element family — 35 components, the only
  ones not shipped), the custom-element consumption idiom, class-hook
  theming, and pointers into the catalog-wide naming reference rather
  than a restatement of it.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*` naming
  convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the Web Components headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root and
  subproject files stay the single source of truth.
- Any component implementation, example page, or helper package.
- **Claiming or implying full 491/491 catalog parity.** The 456-component
  scope, and the 35 components this catalog permanently does not ship
  (and will not — a real architectural limitation, not backlog), are
  stated plainly wherever this skill discusses coverage — never softened
  or omitted.
- The Web Components `*-picker` helpers catalog's own conventions — a
  separate, independently maintained subproject with its own skill,
  `lily-design-system-web-components-helpers-skill`.
- The six full-parity headless catalogs' own idioms (framework-runtime
  bindings, or the plain-HTML no-build-step catalog) — each has its own
  skill, e.g. `lily-design-system-html-headless-skill`.

## 3. Architecture

A `SKILL.md` file (Claude Skill format: YAML frontmatter with `name`,
`description`, `license`, followed by Markdown instructions), plus the
standard subproject scaffolding. No build step, no dependencies, no tests
to run beyond `bin/test`'s required-files checks.

The two architecture decisions `SKILL.md` cites, both made in the Web
Components headless subproject before any component was written and
reproduced here verbatim rather than reworded:

- **Autonomous custom elements over customized built-in elements.**
  Autonomous (`class X extends HTMLElement`, tag `<lily-button>`) works in
  every evergreen browser. Customized built-in (`class X extends
  HTMLButtonElement`, `<button is="lily-button">`) would avoid an extra DOM
  host node, but WebKit has never implemented that half of the spec and has
  stated it will not (WebKit bug 182671), so it silently fails to upgrade
  in Safari. Lily targets every evergreen browser without a caveat, so
  autonomous is the only real choice; the accepted cost is one extra host
  node wrapping the real semantic element in most components.
- **Light DOM only, no shadow root.** A shadow root would isolate a
  component's internals from consumer CSS, contradicting the headless
  contract every other catalog honours ("consumer CSS reaches every
  element via the kebab-case class hooks"). Light DOM also keeps
  cross-component ARIA relationships (`aria-labelledby`,
  `aria-describedby`, `aria-controls`) working with plain
  `document.getElementById`, with no `part`/`::part()` indirection.

## 4. Acceptance criteria

- [x] `SKILL.md` exists with a `name` + `description` frontmatter pair that
      names concrete trigger phrases, per Claude Skill authoring practice.
- [x] `SKILL.md` states the 456/491 scope plainly and lists which 35
      components this catalog permanently excludes and why, without
      implying it will ever reach 491/491.
- [x] `SKILL.md` cites both architecture decisions (autonomous custom
      elements over customized built-ins; light-DOM-only) accurately,
      including the WebKit rationale.
- [x] `SKILL.md` names what's permanently excluded (every interactive
      `*ListItem` family and every table sub-element family — 35
      components total) and why.
- [x] Required subproject files present: `index.md`, `README.md` (symlink),
      `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`.
- [x] `bin/test` passes with this subproject in place.
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [../../lily-design-system-web-components-headless/spec/index.md](../../lily-design-system-web-components-headless/spec/index.md) —
  the Web Components headless library's own specification: the full
  accounting of what's in and out of scope, the architecture decisions in
  full, and the acceptance criteria this skill's claims must stay
  consistent with.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the general Lily concepts skill this subproject specialises for the
  native-custom-element idiom.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the two-skill plan (`lily-design-system-skill` /
  `lily-design-system-maintainer-skill`) and naming convention this
  framework-specific skill extends.
