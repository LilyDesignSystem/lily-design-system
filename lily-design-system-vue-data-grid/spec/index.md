# DataGrid — Specification (Vue helper)

Canonical contract for `@lilydesignsystem/vue-data-grid`, ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../../lily-design-system-svelte-data-grid/spec/index.md)
(the reference implementation; see [spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
for the cross-catalog contract). Same behaviour, Vue idioms. Where this file is silent the Svelte spec decides:
markup (its §4), behaviour (§6), accessibility (§7), non-goals (§9), cell editing and virtualization (§13),
export (§14, and [excel-export](../../lily-design-system-svelte-data-grid/spec/excel-export/index.md)) and the twelve
[cell types](../../lily-design-system-svelte-data-grid/spec/cell-types/index.md).

## 1. Purpose

A headless interactive data grid over `@lilydesignsystem/vue-headless`'s unmodified `DataTable` family. It owns state and
behaviour; it ships no CSS and no English.

## 2. Composition

`DataGrid` renders `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableTH` and
`DataTableTD` from `@lilydesignsystem/vue-headless` (a real dependency, never vendored). `cell-types.ts` and `export-data.ts` are
byte-for-byte copies of the Svelte modules (pure TypeScript) and ship with their own tests.

## 3. Vue idioms

- **Models.** `selected`, `filter`, `sort`, `columnOrder` and `page` are `defineModel`s (`v-model:selected` …); a change emits the matching `update:` event, controlled or not.
- **Events.** `cell-edit`, `files-selected`, `file-remove`, `row-activate` and `export-file` replace the Svelte callbacks. `row-activate` is detected on the vnode (Enter on a cell with no widget activates its row only when a listener is attached, as in Svelte). `exportHandler` is a prop because it must return `false` to stop the save.
- **Slots and render functions.** `empty` and `footer` are slots; a column's `cell`, `headerCell`, `avatar` and `personEditor` are functions returning a vnode, rendered through a small functional component.
- **Cell cache.** Each cell's value and formatted text are read once per row object and column (reset when `columns` changes); the filter index, sort keys and rendered cells share it.
- **Persistence.** `storageKey` restores widths, hidden columns and sort during setup and writes through a `watch` that runs immediately.
- **Root.** The root `<div class="data-grid">` receives the consumer's `class` and attributes by fallthrough.

## 4. Acceptance criteria

§8.1–§8.119 are the Svelte reference's clauses, each exercised in this package's tests with the same section number
(the `export-data` tests §8.57–§8.66, §8.78 and §8.115 run unchanged). Vue's `v-model` events replace the `onSelectionChange`-style callbacks in §8.7 / §8.41; the tests use `onUpdate:selected` and `onUpdate:columnOrder`.

## 5. Relationship to the headless layer

Depends on `@lilydesignsystem/vue-headless` as a regular dependency. In local dev/test `vite.config.js` aliases it to `../lily-design-system-vue-headless/dist/`, so build that first (`bin/list-helper-packages vue`).

## 6. Release notes

See [CHANGELOG.md](../CHANGELOG.md). 0.9.0 is the first release: it is at the version of the Svelte package it ports.
