# @lilydesignsystem/web-components-calendar

A headless, accessible `<lily-calendar-view>` custom element: week, four-week and month views,
previous/next/today, keyboard navigation, a picked day, disabled days and event buttons.
Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
npm install @lilydesignsystem/web-components-calendar @lilydesignsystem/web-components-date-time-picker
```

## Quick start

```html
<lily-calendar-view label="Appointments" view="month" anchor-date="2026-01-15" today="2026-01-08"></lily-calendar-view>
<script type="module">
  import "@lilydesignsystem/web-components-calendar";
  const cal = document.querySelector("lily-calendar-view");
  cal.events = [{ id: "e1", date: "2026-01-06", title: "Check-up" }];
  cal.labels = {
    monthView: "Month",
    today: "Today",
    previous: (v) => `Previous ${v}`,
    next: (v) => `Next ${v}`,
    weekdayAbbr: (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d],
  };
  cal.addEventListener("dayclick", (e) => console.log("picked", e.detail));
  cal.addEventListener("eventclick", (e) => console.log("open", e.detail.id));
</script>
```

## Keyboard

Arrows move the cursor by a day or a week; Home/End go to the row's ends; PageUp/PageDown step by the
view's length; Enter/Space pick the day; `t` goes to today. Disabled days stay focusable but cannot be picked.
- **Typed event fields and editing** (0.5.0): `eventFields` + `event.values` show typed values in the agenda; `onFieldEdit` edits them in place. See [spec](./spec/index.md#typed-event-fields-inline-editing-export-hot-path-caching-050-2026-10-16).
- **Export** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown period's (or every) event.

## Period announcements and limits (0.6.0)

The shown period is announced (`labels.periodAnnouncement`) whenever it changes, however it changed. `minDate` / `maxDate` bound navigation as well as picking: Previous / Next go `aria-disabled` at the limit, Today is inert out of range, keyboard moves are clamped, and `labels.rangeLimit(limit, date)` announces the stop. See spec §18.

## Filtering and sorting (0.6.0)

- **`filter(event)`** hides events it rejects in every view, combining with `search` (both must pass).
- **`eventCompare(a, b)`** orders the events within a day, and so in the agenda; stable.

## Export: copy to clipboard (0.6.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same events, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## In-place edit: validation, undo and redo (0.6.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable: return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(event, header, reason)` is announced, falling back to `labels.editInvalid`. Undo and redo work from anywhere in the calendar.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit` and the `fieldedit` event** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit` and the `fieldedit` event. `labels.undoAnnouncement(event, header, text)` / `labels.redoAnnouncement(event, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.6.0)

- **Marked ranges** (`ranges`: `{ start, end, kind?, label? }`, already there for holidays, closures and terms) now carry their `label` as real text: shown beside the day number (and the agenda date) when there is no `day` snippet, and read as the cell's description (`aria-describedby` a hidden span, several labels joined with ", "), so a screen reader hears why a day is marked and the day is never colour-only. A range without a label marks the day and adds no text. A `day` snippet still receives `ranges` and renders its own.
- **Weekends**: the weekday header cells now carry `data-weekend` like the day cells (`weekendDays`, never defaulted).
- **Shading** is CSS and ships in the 57 reference themes: weekend cells are tinted; a day inside a range is tinted and striped.

## Narrow screens, agenda dates, today and direction (0.6.0)

- **Agenda on a narrow screen.** `agendaBelow` (pixels, for example `640`) makes a viewport narrower than that read as the agenda view; the `view` prop is untouched, so a wide screen goes back to it. A view the user picks with the switcher is respected until the screen is wide again. It uses `matchMedia` after mount (a server renders `view`); without `matchMedia` nothing changes. This replaces a hand-written `matchMedia` switch in the app.
- **Hide the agenda date.** `agendaDate={false}` hides the date beside each day's events visually (a clipped, one-pixel `<time datetime>` with `data-visually-hidden`), so a layout that shows its own date can drop it and a screen reader still gets it. Default `true`.
- **Today holds its contrast.** The reference themes mark today with a ring in the cell's own text colour (`currentColor`) and a bold number, never a fill: it stays readable on a light page, a dark page and a selected cell, and says "today" without colour. The calendar table is `table-layout: fixed` with `min-width: 0` day cells that wrap, so a phone never clips them.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout (the nearest `dir`) ArrowLeft goes to the next day, and Shift+Arrow and Alt+Arrow (moving an event) follow the arrow. Up, Down, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.131–§8.146, including a complete Chinese bundle that must leave no English in the DOM.

## Search (0.6.0)

`search` (a property; the field renders when `labels.search` names it) narrows the events: every word must appear, in any order, ignoring case and diacritics. New: the calendar had no search. Only matching events show, in every view (week, four-week, month, agenda); the default text is the event title and every field's text (`searchText` replaces it). The agenda wraps matches in `<mark class="calendar-view-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. Exports hold what the search leaves. See spec §17.
