# @lilydesignsystem/html-calendar

A headless, accessible `<calendar-view>` custom element: week, four-week and month views,
previous/next/today, keyboard navigation, a picked day, disabled days and event buttons.
Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
npm install @lilydesignsystem/html-calendar @lilydesignsystem/html-date-time-picker
```

## Quick start

```html
<calendar-view label="Appointments" view="month" anchor-date="2026-01-15" today="2026-01-08"></calendar-view>
<script type="module">
  import "@lilydesignsystem/html-calendar";
  const cal = document.querySelector("calendar-view");
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
