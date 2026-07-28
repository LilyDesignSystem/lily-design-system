# Lily Design System™ — Site: Components Routes

Reference: [../../../AGENTS.md](../../../AGENTS.md) for this site's overall
scope, and [../../../spec/index.md](../../../spec/index.md) for the living
spec.

Reference: the canonical [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv)
and per-component docs at [`components/{slug}/index.md`](https://github.com/LilyDesignSystem/lily-design-system/tree/main/components)
in the main `lily-design-system` repo — this directory presents that content
as a web page per component, it does not author it.

## Purpose

One subdirectory per catalog component (`accordion-checkbox/`,
`accordion-link/`, …), each a route: `/components/<slug>/`. The sibling
`+page.svelte` (one level up, in `src/routes/components/`) lists the
components index; each `<slug>/+page.svelte` renders one component's page.

## Per-component route shape

Each `<slug>/+page.svelte` embeds string constants in its `<script>` block,
rendered with `{@html …}`:

- `html` — the full component documentation (description, props, usage,
  keyboard interactions, ARIA, when to use / not to use, styles, testing
  notes, related components, references), adapted from that component's
  canonical `index.md` in the main repo.
- `demoHtml` — a small static markup snippet illustrating the rendered
  component (inside `BEGIN/END auto-generated component example` markers).
- `svelteSource` — a short Svelte usage snippet importing from
  `lily-design-system-svelte-headless`.

Some `<slug>/spec/index.md` files also exist, mirroring the canonical
catalog's per-component spec convention; treat them as read-only copies of
the canonical spec, not this site's own spec-driven-development artefacts.

## Working rules

- Do not hand-write new component prose here — port it from the canonical
  `components/{slug}/index.md`, keeping wording accurate to the current
  props/behaviour.
- Keep slugs, class hooks, and import paths current with the canonical
  catalog (`*-picker`, not the pre-2026-07-28 `*-select`/`*-button`/`*-chooser`
  helper names — this does not affect the catalog's own `theme-select` /
  `theme-select-option` components, which keep their names).
- `bin/test` (repo root) runs `test_lilydesignsystem_github_io`, which
  requires every catalog component to have a directory here with a
  non-empty `+page.svelte` — do not remove a component's directory without
  removing it from `components.tsv` first (that file is out of scope for
  this site).
- There is currently no generator script that produces these pages from
  `components.tsv`; they were authored directly and are kept in sync by
  hand. Introducing one is a decision for the main repo's `bin/` tooling,
  not this site.
