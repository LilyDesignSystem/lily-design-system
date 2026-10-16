# DataGrid export — screen reader support, IME input, virtual scrolling

Deepens [spec/index.md §14](../index.md) (export to CSV, TSV and Excel) on three cross-cutting concerns. The format code is [`export-data.ts`](../../export-data.ts); the buttons and the cell editor are in [`DataGrid.svelte`](../../DataGrid.svelte).

## Summary

An export is a plain, native-control interaction that never depends on what happens to be on screen. A person using a screen reader can find, operate and hear the result of the export buttons; text typed through an input method is never cut short or altered on the way in or out; and a virtualized grid exports its whole data set, not the rows currently rendered.

## Scope

- In: the export buttons and their announcements, the spreadsheet a screen-reader user opens afterwards, the cell editor's handling of input-method composition (the one place a person types into the grid), and the interaction of export with `virtualize`, `pageSize`, `filter`, `sort` and selection.
- Out: how a spreadsheet application reads the file aloud, and how a browser presents a download. Both belong to the user's software.

## 1. Screen reader support

### Principles and rules

- **Real controls.** Each export button is a native `<button type="button">` with visible text from `labels.exportCsv` / `exportTsv` / `exportExcel`, so its accessible name is its text. There is no icon-only button and no English default: a button whose label is absent is not rendered (the repository's rule that a label gates its control).
- **A named group.** The buttons sit in `div.data-grid-export[role="group"]` with `aria-label` from `labels.export`. Without `labels.export` the group has no name; supply it when the grid has more than one toolbar control.
- **The result is announced.** Saving a file produces no page change, and a browser's download notice is not reliably spoken, so after a save the grid writes `labels.exportAnnouncement(format, rowCount, filename)` into its single `aria-live="polite"` status region (`.data-grid-status`) — the same region sort, filter, selection and page changes use. The announcement should say how many rows and which file. It is **not** written when `onExport` returns `false`, because the consumer then owns what happens to the file (upload, preview) and the grid cannot say it was saved.
- **Nothing to export is stated, not silent.** With no row to export the buttons are `disabled` (the native attribute), which removes them from the tab order and announces them as unavailable. If that gap matters for your page, pair it with an `empty` snippet explaining why the grid has no rows.
- **Focus stays put.** An export does not move focus: the button that was pressed keeps it, so a keyboard user can press another format straight away.
- **Keyboard.** The buttons are ordinary tab stops in the toolbar, outside the grid's roving-tabindex cells; Enter and Space operate them. They are **not** inside the grid, so exporting never disturbs the grid cursor.
- **Header row.** The first row of every format is the column headers (`header` text, the same strings that name the grid's columns). In the `.xlsx` the row is bold and frozen (`pane ySplit="1"`), so a spreadsheet's screen-reader navigation treats it as the header row and keeps it in view.
- **Text stays text.** A string is stored as an inline string in the workbook and defused with a leading `'` in CSV/TSV, so a screen reader reads the characters that were in the cell rather than a computed formula result.
- **Typed values.** Numbers, booleans and dates keep their type in the `.xlsx`, so a spreadsheet can announce them as such (and sort and sum them) instead of reading numbers-as-text.

### Acceptance

- [x] Each format button is a labelled native button; absent labels render no button (§8.67).
- [x] The group is named by `labels.export` (§8.67).
- [x] After saving, `labels.exportAnnouncement` is announced in the live region (§8.74).
- [x] No announcement and no save when `onExport` returns `false` (§8.74).
- [x] Buttons are `disabled` with nothing to export (§8.74).
- [x] Header row first; text stays text; types preserved (§8.57, §8.63, §8.64).

## 2. IME input

An input method (for Japanese, Chinese, Korean and other scripts, and some dictation and handwriting tools) builds text in a *composition*: keys are not characters yet, a candidate list is open, and **Enter confirms a candidate** rather than submitting. Two places in the grid take typed text: the cell editor, and the filter field.

### Principles and rules

- **Composition never commits or cancels an edit.** In the cell editor, a keydown with `event.isComposing` — or, because some browsers report the confirming Enter after `isComposing` has already turned false, `keyCode === 229` — is ignored entirely: **Enter does not commit** and **Escape does not cancel** the edit. Enter after composition commits; Escape after composition cancels. (Fixed in 0.7.0: before it, confirming a candidate with Enter committed the half-typed value.) This is the same rule `chat-composer` states for its Enter key.
- **The editor owns its keys.** Every keydown in the editor stops propagation, so none reaches the grid's arrow, Home/End, Page and typeahead handling while text is being composed.
- **The draft is never rewritten while composing.** `oninput` copies the field's text into the draft, and the field's `value` is bound back from it, so setting it again is a no-op (the two are equal) and a re-render cannot reset the composition string. Validation runs on commit, not per keystroke, for the same reason.
- **Blur commits the composed text.** Leaving the field (including the browser finishing a composition on blur) commits what is there, as for any edit.
- **The filter field** (`labels.search`) updates the filter on every `input` event, which fires during composition too. That is deliberate — the rows narrow as the person types — and harmless because filtering is a pure read. The grid does not debounce or wait for composition end.
- **Text goes out as it came in.** Export does no Unicode normalisation, case folding or transliteration: what the cell holds is what the file holds. CSV and TSV are UTF-8 and begin with a byte-order mark so Excel decodes them as UTF-8 rather than the system code page; the `.xlsx` is UTF-8 XML. Characters XML 1.0 forbids (most C0 controls) are dropped from the `.xlsx` and nothing else is.
- **File names.** `exportFilename` may be any Unicode text. Only `\ / : * ? " < > |` and control characters are replaced (with `-`), because those are illegal on common file systems; the `download` attribute carries the rest as is. A sheet name drops `[ ] : * ? / \`, collapses spaces and is cut to 31 **UTF-16 code units** (Excel's limit).
- **Left-to-right is not assumed.** Cells are written in logical order; the file carries no direction marks. Right-to-left rendering is the spreadsheet application's.

### Acceptance

- [x] Enter while composing (`isComposing`, or `keyCode` 229) does not commit; Enter afterwards does (§8.75).
- [x] Escape while composing leaves the edit open; Escape afterwards cancels (§8.76).
- [x] Non-ASCII text (Japanese, accents, emoji) round-trips through CSV, TSV and `.xlsx` unchanged (§8.78).
- [x] The editor commits the composed text (§8.75).
- [x] CSV/TSV carry a UTF-8 byte-order mark in the grid's files (§8.66, §8.68).

## 3. Virtual scrolling

`virtualize` renders only the rows in view (plus the roving tab stop's row) between spacer rows. That is a rendering optimisation and must be invisible to export.

### Principles and rules

- **Export reads the data, not the DOM.** The file is built from the grid's sorted-and-filtered entries (`sortedEntries`, or those among them that are selected with `exportScope="selected"`), never from the rendered cells. A grid showing twelve of 10,000 rows exports 10,000.
- **Independent of scroll position and page.** Scrolling, `scrollTop`, the roving cursor, and `pageSize` (which exports every page, not just the shown one) do not change what is exported. `filter` and `sort` do, because they are part of the view the person is looking at.
- **Selection spans unrendered rows.** Selection is held by row id, so `exportScope="selected"` exports selected rows that are currently scrolled out of the window.
- **No measuring.** Like the rest of the grid, export never reads layout (`getBoundingClientRect`, scroll metrics); it is safe in a hidden or zero-height container.
- **Cost.** One pass over the rows to build a table of cell values, then one pass to serialise; the `.xlsx` ZIP is stored uncompressed, so there is no compression work. The work happens on the main thread when the button is pressed, which is fine to some hundreds of thousands of cells and is the place to use a worker beyond that: `toCsv`, `toTsv` and `toXlsx` are pure functions of a table and can be run in a worker, with the page calling `onExport` handling the resulting blob.
- **Assistive technology still sees the whole grid.** `aria-rowcount` is the total row count and every rendered row carries `aria-rowindex`, so a screen reader announces "row 4,812 of 10,000" while the export button, which does not depend on that window, covers all of it.
- **Large sheets.** Excel's limit is 1,048,576 rows by 16,384 columns. The writer does not enforce it; a table beyond it produces a file Excel will refuse to open in full. Cut the data (filter, `exportScope`) or export CSV instead.

### Acceptance

- [x] A virtualized grid with 300 rows, only about a dozen rendered, exports 300 rows including the last (§8.77).
- [x] The export is the filtered, sorted view across every page (§8.70).
- [x] `exportScope="selected"` exports selected rows by id (§8.71).
- [x] Hidden columns and `exportable: false` columns are never exported (§8.68, §8.69).

## Related topics

- [../index.md §14](../index.md) — the export contract (formats, buttons, options).
- [../index.md §13](../index.md) — cell editing and virtualization (0.6.0).
- [spec/accessibility](../../../spec/accessibility/index.md) — WCAG 2.2 AAA and the live-region rules.
- [spec/internationalization](../../../spec/internationalization/index.md) — no hardcoded strings; right-to-left and bidi.
- [spec/components/chat-composer](../../../components/chat-composer/index.md) — the same Enter-during-IME rule.

## Sources

- [`export-data.ts`](../../export-data.ts), [`export-data.test.ts`](../../export-data.test.ts)
- [`DataGrid.svelte`](../../DataGrid.svelte) — `runExport`, `onEditorKeydown`, `exportEntries`
- [`DataGrid.test.ts`](../../DataGrid.test.ts) — §8.57–§8.77
- UI Events (`isComposing`, `keyCode 229`): https://www.w3.org/TR/uievents/#events-composition-events
- ECMA-376 / ISO 29500 SpreadsheetML, RFC 4180 (CSV)
