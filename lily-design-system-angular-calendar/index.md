# @lilydesignsystem/angular-calendar

A headless, accessible calendar for Angular: week, four-week and month views, previous/next/today,
keyboard navigation, a picked day, disabled days and event buttons. Composes
`@lilydesignsystem/angular-headless`'s `CalendarTable` family and the civil-date arithmetic of
`@lilydesignsystem/angular-date-time-picker`. Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
npm install @lilydesignsystem/angular-calendar @lilydesignsystem/angular-headless @lilydesignsystem/angular-date-time-picker
```

## Quick start

```ts
import { Component, signal } from "@angular/core";
import { CalendarView, type CalendarViewLabels } from "@lilydesignsystem/angular-calendar";

@Component({
  selector: "app-appointments",
  standalone: true,
  imports: [CalendarView],
  template: `
    <lily-calendar-view
      label="Appointments"
      [(view)]="view"
      [(anchorDate)]="anchorDate"
      today="2026-01-08"
      [events]="events"
      [labels]="labels"
      (dayClick)="picked($event)"
      (eventClick)="open($event)"
    />
  `,
})
export class AppointmentsComponent {
  view = signal<"week" | "four-week" | "month">("month");
  anchorDate = signal("2026-01-15");
  events = [{ id: "e1", date: "2026-01-06", title: "Check-up" }];
  labels: CalendarViewLabels = {
    monthView: "Month",
    today: "Today",
    previous: (v) => `Previous ${v}`,
    next: (v) => `Next ${v}`,
    weekdayAbbr: (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d],
  };
  picked(date: string) {}
  open(event: unknown) {}
}
```

## Keyboard

Arrows move the cursor by a day or a week; Home/End go to the row's ends; PageUp/PageDown step by the
view's length; Enter/Space pick the day; `t` goes to today. Disabled days stay focusable but cannot be picked.
- **Typed event fields and editing** (0.5.0): `eventFields` + `event.values` show typed values in the agenda; `fieldEdit` output with `[editableFields]="true"` edits them in place. See [spec](./spec/index.md#typed-event-fields-inline-editing-export-hot-path-caching-050-2026-10-16).
- **Export** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown period's (or every) event.
