# Lily Design System™ — Alpine.js DataGrid — Specification

Living specification. Project-wide rules: [root spec](../../spec/index.md). The contract is the Svelte reference
([spec](../../lily-design-system-svelte-data-grid/spec/index.md)); where they differ, Svelte wins.

## 1. Scope

### Built (0.1.0)

- Columns, rows, `rowId`, `rowNameColumn`, `format` per column, `locale` for text sorting (never defaulted by the grid).
- Multi-column sort (click cycles ascending, descending, off; Shift adds a key), missing values last, ties in input order;
  `aria-sort` on sortable headers and `data-sort-order` while more than one key is set.
- Text filter over the visible columns (every term, case and diacritics ignored, via the shared `search-text`).
- `selectionMode` `none | single | multiple`; select-all covers the current page and shows a mixed state.
- Pagination (`pageSize`), column visibility (`hidable`).
- APG grid keyboard model (shared `grid-navigation`, `direction`) with a roving tabindex.
- Export (shared `export-data`): CSV and TSV download, copy to clipboard, scopes `page | filtered | selected | all`.
- Announcements through a polite live region: sort, filter count, copy result.

### Not built yet

Inline cell editing and undo, column resize / reorder / pinning, row virtualization, the typed cell kinds (number, date, link,
select, person, file, rollup, formula…), Excel export, row activation by click, `storageKey` persistence, `rowFilter`.

## 2. Rules

- No CSS, no text, no icons; every string is a `labels.*` value.
- Shared pure modules are copies of `shared/`; edit `shared/`.

## 3. Acceptance criteria

- [x] `pnpm test` passes (rendering, filter, sort, selection, pagination, columns, keyboard, export).
- [x] `pnpm build` emits `dist/` with types.
- [x] Tests were checked by breaking the code (sort order, page reset, selection, RTL, column toggle).
- [ ] The not-built list above.

## Related topics

[helpers](../../spec/helpers/index.md), [Alpine headless](../../lily-design-system-alpine-headless/spec/index.md).

Lily™ and Lily Design System™ are trademarks.
