# Data Grid Cell Types

Specification for the kinds of value a `DataGrid` column can hold: **text, number, link, date, time, time with time zone, select option, radio group, person, file, rollup and formulas**. For each: the value's shape, how it displays, sorts, filters, edits and exports, and what assistive technology gets.

Builds on [../index.md](../index.md) (the grid contract, §13 cell editing and virtualization, §14 export) and [../excel-export/index.md](../excel-export/index.md).

## Summary

Today a column is described by hooks — `accessor`, `format`, `compare`, `filterable`, `editable` with `editor: "text" | "number"`, `parse`, `validate`, `exportValue`, `align`, `cellClass`, `cellAttrs` and a `cell` snippet. A **cell type** is a named bundle of defaults for those same hooks, plus the markup and keyboard model the type needs. It adds no new machinery: a column with `type: "date"` is a column whose `format`, `compare`, `editor`, `exportValue`, `filterText` and `align` are the date ones, and that carries `data-cell-type="date"` so a stylesheet can target it. Anything a type does can still be overridden by the column's own hook.

## Scope

- In: the twelve types above, the common contract every type follows, and a per-type table of value shape, display, sort, filter, edit, export and accessibility.
- Out: data fetching, uploads, people search, formula evaluation engines, locale data and styling. Those belong to the consumer (see "What Lily does not do").
- Status (0.9.0): **all twelve types are shipped** as `column.type` (tests §8.79–§8.114; `cell-types.ts`). Each section's *Status* line lists where the shipped behaviour differs from the design above.

## 1. Principles and rules

These bind every type; they come from [AGENTS/headless.md](../../../AGENTS/headless.md), [AGENTS/internationalization.md](../../../AGENTS/internationalization.md) and [AGENTS/accessibility.md](../../../AGENTS/accessibility.md).

1. **Data is plain, display is derived.** A cell's *value* is JSON-able (string, number, boolean, `null`, plain object or array) so rows survive serialisation, `localStorage` and the server. Everything a person reads is *derived* from the value by `format`, never stored.
2. **No hardcoded strings, no default locale.** A type never writes English ("Yes", "No file", "Today"). Labels come from `labels.*`; formatting comes from a consumer-supplied `format` or from `Intl.*` configured by a `locale` prop. With no `locale` and no `format` a type shows its raw value (ISO date, plain number): it never guesses the locale.
3. **Headless.** No icons, avatars, fonts, colours or inline styles. A type emits semantic elements, class hooks (`data-grid-{type}`), `data-cell-type`, and `data-*` state. Images (an avatar, a file icon) are the consumer's, supplied through snippets.
4. **Semantics before ARIA.** A link is an `<a>`, a select is a `<select>`, radios are `<input type="radio">` in a `<fieldset>`, a date is a `<time datetime>`. ARIA only where a native element does not exist.
5. **Non-colour meaning.** Status carried by a select option, a rollup or a formula error is always text as well; colour is a consumer's hook, never the only signal.
6. **The grid's keyboard model is not broken.** In `mode="grid"` the arrows move between cells. A cell holding a widget (link, select, radios, file input, person chip with a remove button) follows the existing interactive-cell rule: Enter enters the cell's widgets, Tab moves among them, Escape returns focus to the cell. A type never captures arrows while the cell, rather than a widget in it, has focus.
7. **Edit model is the grid's.** Editable types use the §13 model: F2 / Enter / double click starts editing, Enter commits, Escape cancels, blur commits, `validate` can refuse, `onCellEdit({ rowId, row, columnId, value, previous })` reports, and the grid never mutates `rows`. Composition (IME) keys are ignored by every text-entry editor ([../excel-export/index.md §2](../excel-export/index.md)).
8. **Hot path.** Sort keys, filter text and rollup/formula results are computed **once per `rows`/`columns` change**, never per comparison or keystroke (the grid's existing hot-path rule).
9. **Typed export.** Each type says what it exports; numbers, booleans and dates stay typed in `.xlsx`, strings are defused in CSV/TSV, and a type may override with `exportValue`.
10. **Empty is a value.** `null` / `undefined` is empty: it sorts last in both directions (the grid's rule), displays as empty text, filters as `""`, and exports as an empty cell. A type never shows a placeholder word for it; `labels.emptyCell` (optional) supplies visually-hidden text if a screen reader needs one.

## 2. The common contract

A column opts in with `type`; its other props refine it.

```ts
column: {
  id: "due",
  header: "Due",
  type: "date",            // one of the twelve
  // optional refinements, per type (see §3):
  locale, format, compare, filterText, parse, validate, exportValue, options, …
}
```

What a type supplies (each one overridable by the column's own prop of the same name):

| Facet | Meaning |
| --- | --- |
| `align` | `"start"` for text, link, select, radio group, person, file and text-valued rollups or formulas; `"end"` for number and number-valued rollups or formulas. Dates and times default to `"start"`. Emitted as `data-align` (logical `start` / `end`, never `left` / `right`). |
| `format(value, row)` | The displayed text. |
| `compare(a, b)` | Ordering of two raw values; empties are handled before it is called. |
| `filterText(value, row)` | Lower-cased text the grid's filter matches against (default: the formatted text). |
| `editor` | `"text" \| "number" \| "date" \| "time" \| "select" \| "radio" \| "file" \| …` or none (read-only). |
| `parse(draft, row)` / `validate(value, row)` | Draft → value, and refusal. |
| `exportValue(row)` | The cell in a CSV/TSV/Excel file. |
| `cell` | The default read markup (a snippet may replace it). |
| `data-cell-type` | `data-cell-type="{type}"` on the header and every body cell. |

## 3. The types

### Overview

| Type | Value | Displays as | Sorts by | Filters on | Edits with | Exports as |
| --- | --- | --- | --- | --- | --- | --- |
| text | `string` | the string | collator (`compare`) | the string | text input | string (formula-defused) |
| number | `number \| null` | `format` (e.g. `Intl.NumberFormat`) | numeric | formatted text | number input | typed number |
| link | `string` (href) or `{ href, label? }` | `<a>` | label text | label and href | text inputs | label text (href in the next column when `exportHref`) |
| date | `"YYYY-MM-DD"` | `<time datetime>` formatted | ISO string | formatted text | date field + calendar | typed date |
| time | `"HH:mm"` / `"HH:mm:ss"` | `<time>` formatted | ISO string | formatted text | time field | text `HH:mm[:ss]` |
| time with time zone | `{ time, timeZone }` | time + zone name | minutes at a reference date | formatted text | time field + zone select | text `HH:mm ZONE` |
| select option | option `id` (`string`) | the option's label | option label or option order | label | native `<select>` | option label |
| radio group | option `id` (`string`) | all options, one checked | option order | label | the radios themselves | option label |
| person | `{ id, name, email? }` or an array | name (and optional avatar) | name (collator) | name and email | consumer-supplied lookup | name, `; `-joined |
| file | `{ id, name, size?, type?, href? }[]` | file names | first name, then count | names | `<input type="file">` | names, `; `-joined |
| rollup | computed (number, date, text) | as the result's own type | the result | formatted text | read-only | typed result |
| formulas | expression `string` + computed result | the result | the result | the result | formula text field | typed result (or formula + cached result) |

### 3.1 Text

- **Value**: `string`. `null`/`undefined` is empty.
- **Display**: the string, as text (never `{@html}`); whitespace is the consumer's CSS.
- **Sort / filter**: string order by default is `<`/`>` on code units; for real text supply `compare: new Intl.Collator(locale).compare`. Filter is the case-insensitive substring match on the string.
- **Edit**: `editor: "text"`, a single-line `<input type="text">` named by the column header (`labels.cellEditor(header)`). A multi-line text is a separate editor (`"textarea"`, Enter inserts a line, Ctrl/Cmd+Enter commits) — proposed.
- **Export**: the string; a string starting `=`, `+`, `-`, `@`, tab or CR is defused in CSV/TSV and stored as text in `.xlsx`.
- **Accessibility**: nothing beyond the grid cell; long text is not truncated by Lily (CSS `text-overflow` loses content for AT only if `aria-label` is also set, so do not).
- **Status**: shipped (0.8.0 as `type: "text"`: start-aligned, `Intl.Collator` ordering with a locale).

### 3.2 Number

- **Value**: `number | null`. `NaN` and `±Infinity` are treated as empty.
- **Display**: `format(value)` — normally `new Intl.NumberFormat(locale, options).format`; with a `locale` prop and no `format`, `Intl.NumberFormat(locale)`; with neither, `String(value)`. `align: "end"` so digits line up.
- **Sort**: numeric, empties last. **Filter**: the formatted text (so a person typing "1,200" finds it in a locale that shows "1,200").
- **Edit**: `editor: "number"` (`<input type="number">`, `inputmode="decimal"` for the keypad); empty draft → `null`; a draft that is not a number is refused with `validate`. Decimal and grouping separators follow the browser's number input; if the app wants locale-aware typing, it supplies `parse`.
- **Export**: the typed number — never the formatted text, so Excel can sum it and no locale separator is baked in.
- **Accessibility**: units and currency belong in the *header* or in `format` output ("12.50 £"), not in a colour or icon; `aria-valuetext` is not needed on a cell.
- **Status**: shipped (0.8.0 as `type: "number"`: end-aligned, `Intl.NumberFormat` with `locale` / `numberFormat`).

### 3.3 Link

- **Value**: a URL `string`, or `{ href: string, label?: string, external?: boolean }`.
- **Display**: `<a class="data-grid-link" href>` with the label (the href when no label). Only `http:`, `https:`, `mailto:` and `tel:` hrefs (and same-origin relative ones) become links; anything else — notably `javascript:` and `data:` — renders as plain text. `external` adds `target="_blank"` with `rel="noopener noreferrer"`; opening in a new tab is stated to assistive technology through `labels.opensInNewTab(label)` appended as visually-hidden text, since a screen reader cannot see the target.
- **Keyboard**: the link is a widget in the cell: Enter on the cell enters it, Enter on the link follows it (`onRowActivate` is *not* fired). Middle-click and "copy link address" work because it is a real anchor.
- **Sort**: by label text (collator). **Filter**: label and href.
- **Edit**: two text inputs in one editor (label, address), or a single address input when the value is a string; `validate` refuses a disallowed scheme.
- **Export**: the label text. `exportHref: true` adds a second column "`{header}` URL" holding the address; native `.xlsx` hyperlinks (`<hyperlink>` + relationship) are proposed as a writer extension.
- **Accessibility**: the link's name is its text; an icon-only link must supply `labels.linkName(row)`; never "click here". Focus is visible (consumer CSS).
- **Status**: shipped (0.8.0). Differences from the design above: `exportHref` and native `.xlsx` hyperlinks are not implemented (a link exports its label); the editor edits the address only and keeps the label.

### 3.4 Date

- **Value**: a civil date `"YYYY-MM-DD"` — no time, no zone — the same shape `date-time-picker` and `calendar` use, so a date never shifts across a time-zone boundary. (A JavaScript `Date` value is accepted and read as UTC.)
- **Display**: `<time datetime="2026-10-16">` with text from `Intl.DateTimeFormat(locale, { timeZone: "UTC", …options })` — the `UTC` pin is what keeps a civil date from drifting. No `locale` and no `format` → the ISO date as text.
- **Sort**: lexicographic on the ISO string (correct for civil dates). **Filter**: the formatted text.
- **Edit**: `editor: "date"` composes the existing `DateTimePicker` (`mode="date"`): a typeable field with a calendar dialog, `min`/`max`/`isDateDisabled` from the column, the picker's own required labels. `parse` accepts what the picker accepts; an unparsable draft stays in edit mode with `aria-invalid`.
- **Export**: a typed date (`Date` at UTC midnight → Excel date serial, `yyyy-mm-dd` number format) — the shipped writer already does this for `Date` values.
- **Accessibility**: `<time datetime>` gives machines the ISO value; the visible text is the human one. Relative text ("tomorrow") is the consumer's `format`, and should be paired with the absolute date for AT.
- **Status**: shipped (0.8.0). The editor is the platform's native `<input type="date">` rather than the composed `DateTimePicker`: the grid depends on the headless layer only, and a native field is accessible and locale-aware everywhere. A column wanting the calendar dialog supplies its own `cell` snippet. A civil date exports as a typed date and writes without a time of day in CSV/TSV.

### 3.5 Time

- **Value**: a civil time of day `"HH:mm"` or `"HH:mm:ss"`, 24-hour, no date, no zone.
- **Display**: `<time datetime="14:30">` with `Intl.DateTimeFormat(locale, { timeStyle })` applied to a fixed reference date in UTC (so 12-/24-hour and day-period text follow the locale). No `locale`/`format` → the stored text.
- **Sort / filter**: ISO order (zero-padded, so lexicographic is chronological) / formatted text.
- **Edit**: `editor: "time"`, a time field (the platform `<input type="time">` with `step` for seconds, or `DateTimePicker mode="time"`); `minuteStep` is a column option.
- **Export**: text `HH:mm[:ss]`. A native Excel time (fraction of a day with a time number format) is proposed for the writer; until then the text form is lossless.
- **Accessibility**: a time input must be named; AM/PM is a separate segment in some browsers and is announced by the platform.
- **Status**: shipped (0.8.0): `<time datetime>`, `Intl` text with `locale` / `timeFormat`, a native `<input type="time" step="1">` editor; exported as the stored text.

### 3.6 Time with time zone

- **Value**: `{ time: "HH:mm[:ss]", timeZone: "Europe/London" }` — a time of day *and* the zone it is stated in (an IANA zone id). A bare offset (`"+01:00"`) is accepted as `timeZone` for values that carry only an offset.
- **Display**: the time followed by the zone's short name from `Intl.DateTimeFormat(locale, { timeZone, timeZoneName: "short" })` — `14:30 BST`. The time is shown **in the zone it was stated in**; the grid never converts it to the viewer's zone silently, because that changes what was meant. A consumer who wants conversion supplies `format`.
- **Sort**: a time of day with a zone has no absolute order without a date. Sort by the UTC minutes at a **reference date** the consumer supplies (`referenceDate`, never computed internally — the same SSR-safe rule as `today`); without one, sort by the stated local time and ignore the zone. Equal instants compare equal.
- **Filter**: the formatted text (time and zone name).
- **Edit**: a time field plus a zone select (the grid's `timeZone` choices come from the column, like `date-time-picker`'s `timeZones` / `timeZoneLabels`). Both are named; changing the zone does not change the stated time.
- **Export**: text `14:30 Europe/London` (lossless and sortable by a person); with a `referenceDate`, an additional UTC column is optional.
- **Accessibility**: the zone is read as text, never icon or colour only; the zone select's options carry the consumer's labels (no English city names bundled).
- **Status**: shipped (0.9.0) as `type: "time-zone"`. Differences: with a `locale` and a `referenceDate` the zone is its short name (`BST`), otherwise the zone id as given (a short name depends on the date, and the grid never computes one); `exportUtc` adds the extra UTC column (the time of day at `referenceDate`, headed by `labels.exportUtcHeader`).

### 3.7 Select option

- **Value**: the option's `id` (`string`) — or `string[]` with `multiple: true`.
- **Options**: `column.options: { id: string, label: string, disabled?: boolean, group?: string, …your data }[]`. The *label* is what displays; the id is what is stored; changing a label never invalidates stored data.
- **Display**: the label as text, optionally wrapped by a consumer snippet (a coloured badge). An id with no matching option displays the id and carries `data-unknown`, so stale data is visible instead of blank.
- **Sort**: by label with `compare`/collator, or by option order (`sortBy: "order"`) when the options have a meaning (a pipeline's stages). **Filter**: the label.
- **Edit**: `editor: "select"` is a native `<select>` named by the header, with `<optgroup>` from `group` — chosen over a custom listbox because it is the most accessible control on every platform, including touch. `multiple` uses a checkbox list in a `<fieldset>`. A *searchable* select (a combobox) is a different control, proposed separately, and follows the APG combobox pattern.
- **Export**: the label (`exportAs: "id"` for the id); multiple values are joined with `; `.
- **Accessibility**: the selected state is the label; a colour badge is decoration. A disabled option is `disabled`, not hidden.
- **Status**: shipped (0.8.0): single selection only. `multiple` and a searchable combobox are not implemented.

### 3.8 Radio group

- **Value**: the chosen option's `id` (`string`) or empty.
- **Options**: as for select; a handful (two to five) — more is a select.
- **Display**: a `<fieldset class="data-grid-radio-group">` with the column header as its `<legend>` (visually hidden) and one `<label><input type="radio" name="{gridId}-{rowId}-{columnId}"> label</label>` per option. In a dense grid the consumer may show only the checked label until the cell is entered (`display: "selected"`); the radios exist in the DOM either way.
- **Keyboard**: the radios are widgets in a grid cell, so the cell is *entered* with Enter; inside, Arrow keys move the choice *within the group* (native radio behaviour) and **do not** move the grid cursor; Tab leaves the group; Escape returns focus to the cell. In `mode="table"` they are ordinary tab stops.
- **Edit**: choosing commits at once (`change`); there is no draft and no separate editor mode. `validate` may refuse (the radio snaps back and the message is announced).
- **Sort**: option order. **Filter**: the checked label.
- **Export**: the checked label.
- **Accessibility**: a radio group needs one name per row-and-column or the browser merges groups across rows — the generated `name` guarantees that. Required-ness is `required` on the group's radios, announced by the platform.
- **Status**: shipped (0.8.0). Differences: `display: "selected"` is not implemented (the radios always render in an editable cell), and there is no separate editor mode.

### 3.9 Person

- **Value**: `{ id: string, name: string, email?: string, avatarUrl?: string }`, or an array of them for a multi-person cell.
- **Display**: the **name as text**, always. An avatar, when `avatarUrl` and a consumer `avatar` snippet exist, is decorative (`alt=""`) because the name is adjacent — an avatar is never the only identifier. Several people are an `<ul>` of names; a cap (`maxPeople`) shows "+N" through `labels.morePeople(n)`.
- **Sort**: by name (collator); an array by its first name, then count. **Filter**: name and email.
- **Edit**: choosing a person means a *lookup*, which Lily cannot do (it does no data fetching). The editor is a consumer snippet (`personEditor`) given `{ value, commit, cancel }`; Lily provides the surrounding edit model (focus, Enter/Escape, validate, announcement). The consumer builds the search as an APG combobox.
- **Export**: the name (`; `-joined); `exportAs: "email"` or an extra email column when needed.
- **Accessibility / privacy**: names are personal data — they are exported only because the person pressed Export; Lily stores nothing and sends nothing. Emails appear only if the column asks. A person with no name falls back to their id as text, not to a blank.
- **Status**: shipped (0.9.0). `personEditor` is a snippet given `{ value, commit, cancel }`; a person column with no `personEditor` is read-only even with `editable`. `exportAs: "email"` exports the emails; the extra email column is not built (use `exportAs`).

### 3.10 File

- **Value**: `{ id: string, name: string, size?: number, type?: string, href?: string }[]` — metadata only. The bytes live elsewhere.
- **Display**: the file names as a list; each a link when it has an `href` (same safe-scheme rule as §3.3), otherwise text. `size` is shown when a consumer `formatSize(bytes)` exists (no unit strings bundled). A file-type icon is the consumer's snippet.
- **Sort**: by first file name, then by count. **Filter**: the names.
- **Edit**: a native `<input type="file">` (with `multiple`/`accept` from the column) named by the header. Lily **does not upload**: the chosen `File` objects go to `onFilesSelected({ rowId, row, columnId, files })`, and the consumer uploads, then updates `rows`. A remove control per file (a real button with `labels.removeFile(name)`) calls `onFileRemove`. Drag-and-drop onto the cell is a supplementary path, never the only one.
- **Export**: the names, `; `-joined (no bytes, no paths).
- **Accessibility**: the input has a visible/accessible name; progress and failure are the consumer's to announce through `labels`; the file list is a list so counts are announced.
- **Status**: shipped (0.9.0). `onFilesSelected` and `onFileRemove` report; the file input and remove buttons are shown inline in an `editable` file cell (no separate edit mode). Files dropped on an editable file cell are reported through `onFilesSelected` like the input's.

### 3.11 Rollup

- **Value**: **computed, read-only**. A rollup summarises related data: the cells of a child collection (`row[column.id]` is an array, or `relation(row)` returns one) reduced by an `aggregate`.
- **Aggregates**: `count`, `countUnique`, `sum`, `avg`, `median`, `min`, `max`, `range`, `percentTrue` (of booleans) and `percentEmpty`; or `reduce(values, row)` for anything else. Numbers, dates (`min`/`max`) and text (`countUnique`) are the useful inputs; a non-numeric value under a numeric aggregate is skipped, and an empty set gives empty (not `0`, which would be a lie), except `count` which gives `0`.
- **Display**: the result through the type of the result (`resultType: "number" | "date" | "text"`), so a rollup of dates formats like a date.
- **Sort / filter / export**: on the **result**, typed (a numeric rollup exports a number). It is computed once per `rows` change with the hot-path rule and cached per row.
- **Edit**: none. The cell carries `aria-readonly="true"` and `data-readonly`; F2, Enter and a double click do nothing, and an edit button is not rendered.
- **Accessibility**: say what it is. `labels.rollupDescription?(column)` (for example "Sum of hours") is attached to the header as `aria-describedby` text, because "42" alone does not tell a screen-reader user that the number is derived.
- **Status**: shipped (0.9.0) as `type: "rollup"` with `aggregate`, `reduce`, `relation` and `resultType`. `labels.rollupDescription(header)` is a visually hidden description on the header.

### 3.12 Formulas

- **Value**: a pair — the **expression** (`string`, conventionally starting `=`) stored in the row, and a **result** computed from it. Rows store only the expression; the result is derived.
- **Engine**: Lily ships **no formula engine** and never calls `eval`, `new Function` or any string-to-code path (a security rule, not a gap). The consumer provides `evaluate(expression, context) => FormulaResult`, where `context` gives read access to the row, the other rows and columns by id, and `FormulaResult` is `{ value: unknown } | { error: string }`. Any library (HyperFormula, a small expression parser, a server round-trip's cached result) fits behind it.
- **Display**: the result by its own type; an `error` shows its message as plain text with `data-error` on the cell (never colour alone), so a screen reader reads "Division by zero" and not a code. A cycle is the engine's to report as an error.
- **Sort / filter / export**: on the result. Export writes the typed result (a string result is defused in CSV/TSV); `exportFormulas: true` additionally writes `.xlsx` cells as `<f>expression</f>` with the computed `<v>` cached, so a spreadsheet user keeps the live formula — proposed writer extension. CSV/TSV carry only results.
- **Edit**: `F2` / Enter opens the editor showing the **expression**, not the result (as a spreadsheet does); commit stores the expression and recomputes; `validate` runs the engine's parse and refuses an invalid expression with `aria-invalid` and the engine's message. The editor is a text input; autocomplete of function names is out of scope.
- **Dependencies**: recomputation order and invalidation are the engine's; the grid re-derives a cell's result when `rows`, the expression or `evaluate` changes, once per change.
- **Accessibility**: the cell announces its result; the editor is named `labels.formulaEditor(header)`. A cell whose result is an error says so in text. `aria-readonly` is not set on editable formula cells.
- **Status**: shipped (0.9.0) as `type: "formula"` with `evaluate`, `resultType`; the result is derived once per row, the editor shows the expression. `exportFormulas` writes `.xlsx` formula cells (`<f>` with the result cached); CSV and TSV carry the result.

## 4. Behaviour across the grid's features

| Feature | Rule for all types |
| --- | --- |
| Empty values | Sort last both ways; filter as `""`; export empty. |
| `filter` | Matches `filterText`, default the formatted text; types with several parts (link, person, select) match all their text parts. |
| `sort` | Uses the type's `compare` on raw values, after empties; single-column, tri-state as today. |
| Selection | Unaffected; row ids are unchanged by cell types. |
| Editing | Only editable types: text, number, link, date, time, time with time zone, select option, radio group, person (via snippet), file, formulas. Rollups never. |
| Export | Typed values (number, boolean, date) stay typed; everything else is text; see each type. |
| Virtualization | Types render per row on demand; a type's per-row derived data (rollup, formula results, sort keys) is computed for **all** rows once, not for the rendered window, so sort and export stay correct. |
| `mode="table"` | Widgets are ordinary tab stops; the cell-entering model is not used. |
| IME | Text-entry editors (text, number, link, formulas, time fields) ignore composition keys; selects and radios take none. |
| RTL | Cells are written in logical order; `data-align` uses `start` / `end`, never `left` / `right`. |

## 5. What Lily does not do

Fetch people or files, upload or store files, evaluate formulas, ship locale data or time-zone databases (the browser's `Intl` is used), bundle avatars, icons or file-type glyphs, localise strings, sanitise HTML (a cell never renders HTML from data), or persist edits. Each of these is a prop, a snippet or a callback so the consumer owns it.

## 6. Acceptance criteria

- [x] Each type states its value shape, display, sort, filter, edit, export and accessibility (this document, §3).
- [x] **Text** and **number** are implemented through `editor`, `format`, `parse`, `validate` and typed export (spec §13–§14; tests §8.47–§8.53, §8.67–§8.74).
- [x] `column.type` selects a bundle of defaults and sets `data-cell-type` on the header and cells (§8.79).
- [x] A column's own `format`, `compare`, `parse`, `validate`, `exportValue` and `cell` override a type's (§8.80, §8.96).
- [x] Link refuses `javascript:` and other unsafe schemes (renders text) and marks new-tab links for assistive technology (§8.82, §8.83, §8.94).
- [x] Date and time round-trip civil values without time-zone drift (§8.85–§8.87, §8.95).
- [x] Time with time zone never converts silently and takes its sort reference date from the consumer (§8.98–§8.100).
- [x] Select uses a native `<select>`; radio group's inputs share a per-row, per-column `name` (§8.88–§8.93).
- [x] Person shows the name as text and treats an avatar as decoration; file never uploads (§8.101–§8.104, §8.114).
- [x] Rollup and formula cells are derived once per change, read-only (`aria-readonly`) for rollups, and formula errors are text (§8.105–§8.113).
- [x] No shipped type writes a user-facing string of its own; every label is a `labels.*` prop (`opensInNewTab`, `invalidValue`, `radioGroup`, `cellEditor`).

## Related topics

- [../index.md](../index.md) — the grid contract (§13 editing, §14 export).
- [../excel-export/index.md](../excel-export/index.md) — export, IME, virtual scrolling.
- [spec/helpers](../../../spec/helpers/index.md) — the `date-time-picker` this composes for dates and times.
- [spec/internationalization](../../../spec/internationalization/index.md), [spec/accessibility](../../../spec/accessibility/index.md), [spec/headless](../../../spec/headless/index.md).

## Sources

- [`DataGrid.svelte`](../../DataGrid.svelte) — `DataGridColumn`, `editor`, `format`, `exportCell`.
- [`export-data.ts`](../../export-data.ts) — typed export.
- WAI-ARIA Authoring Practices: Grid, Radio Group, Combobox; HTML Standard (`<time>`, `<input type="file">`); ECMA-402 (`Intl`).
