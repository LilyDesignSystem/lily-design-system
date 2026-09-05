# Lily Design System™ — HTML Helpers Skill

A Claude Skill ([`SKILL.md`](SKILL.md)) that explains
[`lily-design-system-html-helpers`](../lily-design-system-html-helpers/):
the catalog of six opinionated, reusable HTML **web components (custom
elements)** — `theme-picker`, `locale-picker`, `text-size-picker`,
`motion-picker`, `share-picker`, `date-time-picker` — that sit alongside the
HTML headless library, each owning one whole interaction end to end.

It is the framework-specific counterpart, for the HTML helpers catalog, to
the general [`lily-design-system-skill`](../lily-design-system-skill/), and
sits beside [`lily-design-system-html-headless-skill`](../lily-design-system-html-headless-skill/),
which covers the neighbouring headless component library instead. It follows
the `lily-design-system-` prefix that marks the monorepo's implementation
subprojects, because it is fully bound to this repository's own catalog and
conventions, not a portable general-purpose package living outside it.

## What it's for

Load this skill when someone asks how to use Lily's HTML `*-picker`
helpers, what one of their custom elements renders or its keyboard contract,
how the shared icon-button-plus-listbox shape differs from `share-picker`'s
disclosure or `date-time-picker`'s field-plus-dialog shape, or how this
catalog relates to the independent Web Components helpers copy. It doesn't
restate the root `AGENTS/helpers.md` rules or any individual helper's own
`spec/index.md` in full — it points at them, so the underlying source stays
the single source of truth.

## Structure

- [`SKILL.md`](SKILL.md) — the skill itself: the six helpers and what each
  owns, the three markup shapes (preference listbox, share disclosure,
  date-time field+dialog), the attribute/property/event contract, the
  install-and-consume idiom, and the relationship to the Web Components
  helpers catalog.

Scaffolded to match the other implementation subprojects — including the
copied + generated special files and the [`.git-subtree-push`](.git-subtree-push)
config `bin/git-subtree-push` reads — so it can be pushed to its own
standalone public repository the same way once that remote is configured;
as of this writing no such remote exists yet.
