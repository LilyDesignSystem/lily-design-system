# @lilydesignsystem/react-calendar

A headless, accessible calendar for React 19: week, four-week and month views, previous/next/today,
keyboard navigation, a picked day, disabled days and consumer-rendered events. Composes
`@lilydesignsystem/react-headless`'s `CalendarTable` family and the civil-date arithmetic of
`@lilydesignsystem/react-date-time-picker`. Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
npm install @lilydesignsystem/react-calendar @lilydesignsystem/react-headless @lilydesignsystem/react-date-time-picker
```

## Quick start

```tsx
import CalendarView from "@lilydesignsystem/react-calendar";

function Appointments() {
  return (
    <CalendarView
      label="Appointments"
      defaultView="month"
      defaultAnchorDate="2026-01-15"
      today="2026-01-08"
      minDate="2026-01-01"
      events={[{ id: "e1", date: "2026-01-06", title: "Check-up" }]}
      onDayClick={(date) => console.log("picked", date)}
      onEventClick={(event) => console.log("open", event.id)}
      labels={{
        monthView: "Month",
        weekView: "Week",
        today: "Today",
        previous: (view) => `Previous ${view}`,
        next: (view) => `Next ${view}`,
        periodAnnouncement: (view, start, end) => `${view}: ${start} to ${end}`,
        weekdayAbbr: (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d],
        day: (iso) => iso,
      }}
      day={({ date, events, openEvent }) => (
        <>
          <span>{Number(date.slice(8))}</span>
          {events.map((e) => (
            <button key={e.id} type="button" onClick={() => openEvent(e)}>
              {String(e.title)}
            </button>
          ))}
        </>
      )}
    />
  );
}
```

## Keyboard

Arrows move the cursor by a day or a week; Home/End go to the row's ends; PageUp/PageDown step by the
view's length; Enter/Space pick the day; `t` goes to today. Disabled days stay focusable but cannot be picked.
- **Typed event fields and editing** (0.5.0): `eventFields` + `event.values` show typed values in the agenda; `onFieldEdit` edits them in place. See [spec §1](./spec/index.md#1-typed-event-fields-inline-editing-export-hot-path-caching-050-2026-10-16).
- **Export** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown period's (or every) event.
