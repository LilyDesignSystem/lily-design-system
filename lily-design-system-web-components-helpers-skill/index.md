# Lily Design System™ — Web Components Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains
[`lily-design-system-web-components-helpers`](../lily-design-system-web-components-helpers/):
the catalog of six opinionated, reusable Web Components (custom elements)
— `<lily-theme-picker>`, `<lily-locale-picker>`, `<lily-text-size-picker>`,
`<lily-motion-picker>`, `<lily-share-picker>`, `<lily-date-time-picker>` —
that sit alongside the Web Components headless catalog, each owning one
whole interaction end to end.

This catalog is a maintainer-directed (2026-09-03) **independent copy** of
[`lily-design-system-html-helpers`](../lily-design-system-html-helpers/),
differing only in tag prefix and package naming; nothing ports between the
two automatically. This skill states that provenance precisely rather than
overstating it (a fork with automatic sync) or understating it (an
unrelated catalog that happens to look similar).

It is the framework-specific counterpart, for the Web Components helpers
catalog, to the general
[`lily-design-system-skill`](../lily-design-system-skill/), and sits beside
[`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/),
which covers the neighbouring (456/491, its full achievable scope) headless component
library instead. It follows the `lily-design-system-` prefix that marks
the monorepo's implementation subprojects, because it is fully bound to
this repository's own catalog and conventions, not a portable
general-purpose package living outside it.

## What it's for

Load this skill when someone asks how to use Lily's Web Components
`*-picker` helpers, what one of their `<lily-*-picker>` custom elements
renders or its keyboard contract, how the shared icon-button-plus-listbox
shape differs from `share-picker`'s disclosure or `date-time-picker`'s
field-plus-dialog shape, or how this catalog relates to the HTML helpers
catalog it was independently copied from. It doesn't restate the root
`AGENTS/helpers.md` rules or any individual helper's own `spec/index.md` in
full — it points at them, so the underlying source stays the single source
of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers and what each
  owns, the three markup shapes (preference listbox, share disclosure,
  date-time field+dialog), the attribute/property/event contract, the
  install-and-consume idiom, and the precise provenance relationship to the
  HTML helpers catalog.

Scaffolded to the same full-subproject bar as its siblings — including the
copied + generated special files and the
[`.git-subtree-push`](.git-subtree-push) config `bin/git-subtree-push`
reads — so it can be pushed to its own standalone public repository the
same way once that remote is configured; as of this writing no such remote
exists yet.
