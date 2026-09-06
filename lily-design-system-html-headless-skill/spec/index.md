# Lily Design System™ — HTML Headless Skill — Specification

Living specification for this subproject. Single source of truth for
spec-driven development of it. For project-wide rules, read the root
[spec/index.md](../../spec/index.md) first, and
[spec/agent-skills/index.md](../../spec/agent-skills/index.md) for the
two-skill plan (`lily-design-system-skill` and
`lily-design-system-maintainer-skill`) this subproject builds on top of.

## 1. Role in the ecosystem

A Claude Skill that explains how to consume
[`lily-design-system-html-headless`](../../lily-design-system-html-headless/):
one of the seven canonical, full-catalog (491/491) headless component
libraries, and the framework's own **reference implementation** — the
canonical semantic HTML, ARIA, and keyboard behaviour every other framework
binding mirrors. It is content and documentation, not a component
implementation — it ships no headless components, no example app, no
helper packages of its own.

This is the framework-specific counterpart, for the HTML headless library,
to the general [`lily-design-system-skill`](../../lily-design-system-skill/).
Its own sibling, [`lily-design-system-html-helpers-skill`](../../lily-design-system-html-helpers-skill/),
covers the neighbouring `*-picker` helpers catalog
(`lily-design-system-html-helpers`) instead of the headless library.

## 2. Scope

### In scope

- `SKILL.md` — the skill: the HTML headless library's identity and scope
  (491-component full parity, reference-implementation status), the
  component-file shape (HTML comment header + markup + optional `<script>`
  IIFE), the copy-and-use / no-build-step consumption idiom, class-hook
  theming, and pointers into the catalog-wide naming and composition
  reference rather than a restatement of it.
- The standard subproject file set (`index.md`, `README.md` symlink,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, the special files,
  `.git-subtree-push`), since it follows the `lily-design-system-*` naming
  convention and `bin/test` holds it to the same bar as the other
  implementation subprojects.

### Explicitly out of scope

- Restating `AGENTS/*.md` or the HTML headless subproject's own
  `spec/index.md` in full — `SKILL.md` points at them so the root and
  subproject files stay the single source of truth.
- Any component implementation, example page, or helper package.
- The `*-picker` helpers catalog's own conventions — that's
  `lily-design-system-html-helpers-skill`'s job.
- The separate, partial Web Components headless catalog's conventions
  (native custom elements, light-DOM-only, 125/491) — that catalog has its
  own architecture decisions and its own skill.

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
- [ ] The special files are present via `bin/sync-special-files`.
- [ ] A `.git-subtree-push` remote is actually configured and the first
      push to a standalone public repository has happened; not yet done
      as of 2026-09-04.

## 5. Related topics

- [../../lily-design-system-html-headless/spec/index.md](../../lily-design-system-html-headless/spec/index.md) —
  the HTML headless library's own specification; the canonical source this
  skill points at rather than duplicates.
- [../../lily-design-system-skill/spec/index.md](../../lily-design-system-skill/spec/index.md) —
  the general Lily concepts skill this subproject specialises for the
  plain-HTML idiom.
- [../../spec/agent-skills/index.md](../../spec/agent-skills/index.md) —
  the two-skill plan (`lily-design-system-skill` /
  `lily-design-system-maintainer-skill`) and naming convention this
  framework-specific skill extends.
