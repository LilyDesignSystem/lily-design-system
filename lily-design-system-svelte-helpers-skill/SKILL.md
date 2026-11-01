---
name: lily-design-system-svelte-helpers-skill
description: Explains Lily Design System's Svelte helper packages — the canonical reference every other framework's helpers port from, one top-level subproject per package — covering the eleven *-picker helpers (theme, locale, text-size, motion, share, search, link, menu, settings, time-zone, date-time), picker-bar, and the data-grid, kanban-board, gantt-chart and calendar packages; their npm package names and install idiom; the shared icon-button-opens-popup contract; and the idempotent-apply rule that exists because a re-entrant $effect once froze a picker mid-open. Use when someone asks how to install or use a Lily Svelte helper, wants the Svelte 5 idiom for one, asks why applying a preference must be idempotent, or asks which helpers are canonical when frameworks disagree.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Svelte helpers

The Svelte 5 helper packages: opinionated packages that each own one
complete interaction end to end, sitting above the plain headless
library. **They are canonical**: per `AGENTS/helpers.md`'s "Svelte is
canonical" rule, every other framework's helpers (React, Vue, Angular,
Blazor, HTML, Nunjucks, Web Components) port their contract from these,
and when a framework disagrees with Svelte, Svelte wins.

Each package is its own top-level subproject of the monorepo,
`lily-design-system-svelte-{package}/`, with its own toolchain, spec,
tests and npm package, published from the monorepo (since 2026-10-10; before that they lived
together in a `lily-design-system-svelte-helpers` catalog, now deleted).
`bin/list-helper-packages svelte` lists them in build order. The list,
with links: `spec/helpers/index.md` § "Svelte helper packages".

## The packages

| Package            | Owns                                                                   | Shape                                                               |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `theme-picker`     | a **preference** (theme stylesheet + `data-theme`)                     | icon button + listbox                                               |
| `locale-picker`    | a **preference** (`lang`/`dir`)                                        | icon button + listbox                                               |
| `text-size-picker` | a **preference** (`data-text-size`)                                    | icon button + listbox                                               |
| `motion-picker`    | a **preference** (`data-motion`; defaults to `prefers-reduced-motion`) | icon button + listbox                                               |
| `share-picker`     | an **action**                                                          | icon button + disclosure of real `<a>` links                        |
| `search-picker`    | an **action** (GET to `/?<text>`)                                      | icon button + disclosure holding a search form                      |
| `link-picker`      | an **action** (the app's page links)                                   | home icon button + disclosure of real `<a>` links                   |
| `menu-picker`      | whatever the app provides                                              | hamburger icon button + disclosure panel                            |
| `settings-picker`  | whatever the app provides                                              | cog icon button + disclosure panel                                  |
| `time-zone-picker` | a **preference** (`data-time-zone`, an IANA id)                        | clock icon button + listbox of zones by UTC offset (CLDR names)     |
| `date-time-picker` | a **form value**                                                       | typeable field + icon button opening an APG date-picker dialog      |
| `picker-bar`       | a composition                                                          | link, search, theme, locale, (time-zone), text-size, share in a row |
| `data-grid`        | grid state and behaviour                                               | over the headless `DataTable` family                                |
| `kanban-board`     | board state and keyboard moves                                         | over the headless `KanbanTable` family                              |
| `gantt-chart`      | schedule state and editing                                             | over the headless `GanttTable` family + `date-time-picker`          |
| `calendar`         | day / week / four-week / month / agenda browsing                       | over the headless `CalendarTable` family + `date-time-picker`       |
| `filter`           | a filter tree (conditions and groups)                                  | outputs JSON, SQL, MongoDB, OData or a predicate                    |
| `markdown-editor`  | a form value (Markdown text)                                           | textarea + toolbar of buttons that write Markdown                   |
| `org-editor`       | a form value (Emacs Org text)                                          | textarea + toolbar for effects, tasks, planning, drawers            |
| `locale-translations` | data: the 64 label packs and CLDR zone-name packs                   | per-locale exports, no markup                                       |

The five preference pickers (theme, locale, text-size, motion, time-zone) share one contract (`theme-picker` also has an opt-in native `<select>`, `variant="select"`): root
`<div class="{helper} {class}">` with a hidden input for form
participation, a `<button class="{helper}-button" aria-haspopup="listbox"
aria-expanded aria-controls>` whose only content is an `aria-hidden`
icon, and a `<ul class="{helper}-list" role="listbox" hidden>` of
`<li role="option" aria-selected>` — the WAI-ARIA APG listbox keyboard
pattern throughout. The link-based pickers (`share-picker`,
`link-picker`) are disclosures of real `<a>` elements, not
`role="option"` items, because `role="menuitem"` would strip middle-click
and open-in-new-tab. `date-time-picker` is a form control, so it pairs a
typeable field with its trigger. Full contracts: `AGENTS/helpers.md`
(loaded into this skill's `AGENTS.md`) and each package's own
`spec/index.md`.

## Install

Each package is published to npm as `@lilydesignsystem/svelte-{package}`
(for example `@lilydesignsystem/svelte-theme-picker`). Check
`npm view @lilydesignsystem/svelte-{package} version` for what is
published before depending on one.

```sh
pnpm add @lilydesignsystem/svelte-theme-picker
```

```svelte
<script lang="ts">
  import { ThemePicker } from "@lilydesignsystem/svelte-theme-picker";
</script>
```

Every package's `peerDependencies` requires `svelte` `^5.0.0`; most also
list `@lilydesignsystem/svelte-headless` (`>=0.4.0 <1.0.0`) as a peer dependency, so install it
once. `picker-bar`, `gantt-chart` and `calendar` also depend on sibling helper packages.

## The idempotent-apply rule

Applying an already-applied preference must be a no-op: no DOM write, no
`localStorage` write, no change callback. This matters more in Svelte
than it sounds: a `$effect` re-runs on every dependency change, not only
on a real value change, and firing the consumer's change callback each
time invites the consumer to write state back into the same effect's
dependencies — which loops straight back in. Unguarded, that loop ends in
Svelte's own `effect_update_depth_exceeded`: the component stops updating
its DOM entirely, and the picker freezes mid-open with a stale
`aria-expanded="true"` over a hidden listbox — a symptom that looks
nothing like "re-entrant apply" to whoever hits it first. The callback
contract is once per applied change, and the idempotency guard is what
makes that true. See `AGENTS/helpers.md`'s "Applying is idempotent" rule
for the full explanation, including how the other frameworks each reach
the apply step more often than the value changes for their own
framework-specific reasons.

## Svelte 5 idiom

Same runes-based shape as the headless catalog (`class` prop, `$props()`
with rest-props, `$bindable()`, `Snippet` children, no `<style>` blocks)
— see `lily-design-system-svelte-headless-skill` for the idiom itself,
and `AGENTS/sveltekit.md` for the general Svelte 5 + SvelteKit 3
conventions this repository follows.

## Recent additions (2026-10-24 onward)

`bin/list-helper-packages svelte` is the authoritative list (20 packages, each `@lilydesignsystem/svelte-<package>`). Beyond what the sections above describe, it holds:

- `time-zone-picker` (2026-10-24): an icon button (clock) opening a listbox of IANA zones labelled `UTC±HH:MM – name`, names from Unicode
  CLDR packs (`zoneNamesFrom(pack)`); sets `data-time-zone` on a target element; a `locale` is required.
- `theme-picker` `variant="select"` (2026-10-30, opt-in): a native `<select class="theme-picker-select">` in place of the button and listbox.
- `picker-bar` renders `time-zone-picker` after `locale-picker` when given `labels.timeZone` and a time-zone locale.
- `markdown-editor` and `org-editor` (2026-10-24): a textarea with a toolbar of buttons that write Markdown or Emacs Org markup.
- `locale-translations`: the 64 label packs and the CLDR zone-name packs, per locale.

## The grid-like helpers and label packs

Beyond the pickers, the Svelte catalog has `data-grid`, `kanban-board`, `gantt-chart`, `calendar` and `filter` (a filter builder whose
output is JSON, SQL, MongoDB, OData or a predicate) as separate packages (@lilydesignsystem/svelte-data-grid and so on;
`bin/list-helper-packages svelte` lists them in build order). They follow the Svelte package's contract: where Svelte and Svelte disagree,
Svelte wins.

They take a large `labels` object and ship no English, so do not write it by hand per locale. `shared/label-packs/` holds one JSON
pack for each of 64 locales (English plus 63 **unreviewed machine drafts**; have a native speaker check screen-reader wording).
`labelsFor("data-grid", pack)` from `shared/label-pack.ts` gives a drop-in `labels`. A string a pack lacks leaves the label unset rather than showing another language, and date-dependent labels (weekday names,
period titles) come from `Intl`. Full contract: `spec/label-packs/index.md`.

The Gantt chart can render a critical path (`critical`, `slack`, `labels.criticalLabel`); the optional calculation (`criticalPath()`,
with lag in calendar or working days) ships in the Svelte Gantt package (the pure module is `shared/critical-path.ts`), and every other catalog's Gantt package ports it.

## When NOT this skill

- For the plain headless catalog components (not the picker helpers), use
  `lily-design-system-svelte-headless-skill`.
- For framework-agnostic Lily concepts, terminology, and naming/composition
  patterns that apply across all seven frameworks, use
  `lily-design-system-skill`.
