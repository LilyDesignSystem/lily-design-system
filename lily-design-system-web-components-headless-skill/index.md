# Lily Design System™ — Web Components Headless Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains how to consume
[`lily-design-system-web-components-headless`](../lily-design-system-web-components-headless/):
Lily's native custom-element implementation of Lily's canonical
component catalog at its **full achievable scope** as of 2026-09-06 —
456 of the 491 components, proving the pattern (autonomous custom
elements, light DOM only, no framework runtime) at real scale. **It is
not a 491/491 peer of the other seven headless catalogs** (HTML, Svelte,
React, Vue, Angular, Blazor, Nunjucks) and never will be — the remaining
35 are permanently excluded by a real architectural limitation, not
backlog; it is an 8th catalog, added 2026-09-03.

It is the framework-specific counterpart, for this catalog, to the general
[`lily-design-system-skill`](../lily-design-system-skill/) — the same
relationship the maintainer skill has to this repository's own tooling, but
scoped here to *using* one particular, headless library rather than
the whole system's concepts. It follows the `lily-design-system-` prefix
that marks the monorepo's implementation subprojects, because it is fully
bound to this repository's own catalog and conventions, not a portable
general-purpose package living outside it.

## What it's for

Load this skill when someone asks how to use Lily's native Web Components
headless catalog, wants the custom-element usage idiom, needs to know
exactly which 35 components this catalog permanently excludes (and why),
asks why it isn't full parity with the other seven catalogs, or asks
about the autonomous-custom-elements-vs-customized-built-ins or
light-DOM-only architecture decisions. It doesn't restate the
root `AGENTS/*.md` rules or the Web Components headless subproject's own
`spec/index.md` in full — it points at them, so the underlying source stays
the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the catalog's scope
  (which 456 components, spanning which categories), the two architecture
  decisions (autonomous custom elements over customized built-ins,
  light-DOM-only), the two structural patterns components use, what's
  permanently excluded and why, the consumption idiom, and pointers into
  the catalog-wide naming reference.

Scaffolded to the same full-subproject bar as its siblings — including the
copied + generated special files and the
[`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such remote
exists yet.
