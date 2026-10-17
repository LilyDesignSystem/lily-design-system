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
