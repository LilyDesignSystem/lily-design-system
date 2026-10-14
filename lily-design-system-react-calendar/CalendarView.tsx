import * as React from "react";
import {
  CalendarTable,
  CalendarTableBody,
  CalendarTableHead,
  CalendarTableRow,
  CalendarTableTD,
  CalendarTableTH,
} from "@lilydesignsystem/react-headless";
import {
  addDays,
  addMonths,
  daysInMonth,
  firstDayOfWeekFor,
  formatIsoDate,
  monthMatrix,
  parseIsoDate,
  weekdayOf,
} from "@lilydesignsystem/react-date-time-picker";

export type CalendarView = "week" | "four-week" | "month";

export type CalendarEvent = {
  /** Stable event identifier. */
  id: string;
  /** Single-day event date. Mutually exclusive with start/end. */
  date?: string;
  /** Multi-day event start (inclusive). */
  start?: string;
  /** Multi-day event end (inclusive). */
  end?: string;
  [key: string]: unknown;
};

/**
 * Every field is optional, but its presence gates the control it names —
 * no baked-in English fallback. See spec/index.md §5.
 */
export type CalendarViewLabels = {
  weekView?: string;
  fourWeekView?: string;
  monthView?: string;
  previous?: (view: CalendarView) => string;
  next?: (view: CalendarView) => string;
  today?: string;
  periodAnnouncement?: (view: CalendarView, start: string, end: string) => string;
  /** Full weekday name. `weekday` is 0 = Sunday … 6 = Saturday. */
  weekday?: (weekday: number) => string;
  /** Short weekday form for the column header's visible text. */
  weekdayAbbr?: (weekday: number) => string;
  /** Full accessible name for one day cell. */
  day?: (isoDate: string, weekday: number, outsidePeriod: boolean) => string;
};

export type DayArgs = {
  date: string;
  events: CalendarEvent[];
  isToday: boolean;
  outsidePeriod: boolean;
  selected: boolean;
  disabled: boolean;
  /** Call from the event's own button/click handler to fire `onEventClick`. */
  openEvent: (calendarEvent: CalendarEvent) => void;
};

/** Public props for CalendarView. See `spec/index.md` §5 for the contract. */
export type Props = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> & {
  /** Accessible name for the calendar, passed through to CalendarTable. */
  label: string;
  /** Which period is shown. Controlled when given. */
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** ISO date the visible period is computed around. Controlled when given. */
  anchorDate?: string;
  defaultAnchorDate?: string;
  onAnchorDateChange?: (anchorDate: string) => void;
  /** ISO date the user has picked. Controlled when given; distinct from the keyboard cursor. */
  selectedDate?: string;
  defaultSelectedDate?: string;
  onSelectedDateChange?: (selectedDate: string) => void;
  /** Events to place into day cells. */
  events?: CalendarEvent[];
  /** ISO date marking "today"; never computed internally (stays SSR-safe). */
  today?: string;
  /** Earliest pickable ISO date. */
  minDate?: string;
  /** Latest pickable ISO date. */
  maxDate?: string;
  /** Extra disabled-day test. Disabled days stay focusable but cannot be picked. */
  isDisabled?: (isoDate: string) => boolean;
  /** BCP 47 locale, passed to firstDayOfWeekFor. */
  locale?: string;
  labels?: CalendarViewLabels;
  /** Fired whenever the visible period changes. */
  onNavigate?: (view: CalendarView, start: string, end: string) => void;
  /** Fired when an enabled day cell is activated (Enter/Space, or click). */
  onDayClick?: (isoDate: string) => void;
  /** Fired when a rendered event is activated, via the `day` render prop's `openEvent`. */
  onEventClick?: (calendarEvent: CalendarEvent) => void;
  /** Renders one day cell's content. */
  day?: (args: DayArgs) => React.ReactNode;
  /** Extra CSS class on the root. */
  className?: string;
};

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate: string, firstDayOfWeek: number): string {
  const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
  return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(
  view: CalendarView,
  anchorDate: string,
  firstDayOfWeek: number,
): string[][] {
  if (view === "month") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [];
    return monthMatrix(parsed.year, parsed.month, firstDayOfWeek);
  }
  const start = weekStart(anchorDate, firstDayOfWeek);
  const rows = view === "week" ? 1 : 4;
  const weeks: string[][] = [];
  for (let row = 0; row < rows; row++) {
    const week: string[] = [];
    for (let col = 0; col < 7; col++) week.push(addDays(start, row * 7 + col));
    weeks.push(week);
  }
  return weeks;
}

/** The inclusive [start, end] ISO range `view` covers. */
export function periodRange(
  view: CalendarView,
  anchorDate: string,
  firstDayOfWeek: number,
): [string, string] {
  if (view === "month") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [anchorDate, anchorDate];
    return [
      formatIsoDate({ ...parsed, day: 1 }),
      formatIsoDate({ ...parsed, day: daysInMonth(parsed.year, parsed.month) }),
    ];
  }
  const start = weekStart(anchorDate, firstDayOfWeek);
  const len = view === "week" ? 7 : 28;
  return [start, addDays(start, len - 1)];
}

/** Whether `isoDate` falls outside `anchorDate`'s own calendar month. Always false for week/four-week. */
export function isOutsidePeriod(
  view: CalendarView,
  isoDate: string,
  anchorDate: string,
): boolean {
  if (view !== "month") return false;
  const d = parseIsoDate(isoDate);
  const anchor = parseIsoDate(anchorDate);
  if (!d || !anchor) return false;
  return d.year !== anchor.year || d.month !== anchor.month;
}

/** Map each event to every ISO date it covers. */
export function eventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  const add = (isoDate: string, event: CalendarEvent) => {
    const list = map.get(isoDate);
    if (list) list.push(event);
    else map.set(isoDate, [event]);
  };
  for (const event of events) {
    if (event.date) {
      add(event.date, event);
    } else if (event.start && event.end) {
      let cursor = event.start;
      while (cursor <= event.end) {
        add(cursor, event);
        cursor = addDays(cursor, 1);
      }
    }
  }
  return map;
}

/** Controlled-or-default state: a prop wins when given. */
function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = React.useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const set = (next: T) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  return [current, set];
}

export function CalendarView({
  label,
  view: viewProp,
  defaultView = "month",
  onViewChange,
  anchorDate: anchorProp,
  defaultAnchorDate,
  onAnchorDateChange,
  selectedDate: selectedProp,
  defaultSelectedDate,
  onSelectedDateChange,
  events = [],
  today,
  minDate,
  maxDate,
  isDisabled,
  locale,
  labels,
  onNavigate,
  onDayClick,
  onEventClick,
  day,
  className = "",
  ...restProps
}: Props): React.ReactElement {
  const [view, setView] = useControllable<CalendarView>(viewProp, defaultView, onViewChange);
  const [anchorDate, setAnchorDate] = useControllable<string>(
    anchorProp,
    defaultAnchorDate ?? today ?? "1970-01-01",
    onAnchorDateChange,
  );
  const [selectedDate, setSelectedDate] = useControllable<string | undefined>(
    selectedProp,
    defaultSelectedDate,
    onSelectedDateChange as ((next: string | undefined) => void) | undefined,
  );

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = React.useState(anchorDate);
  const [statusMessage, setStatusMessage] = React.useState("");
  const focusPending = React.useRef(false);

  const firstDayOfWeek = firstDayOfWeekFor(locale);
  const days = periodDays(view, anchorDate, firstDayOfWeek);
  const flatDays = days.flat();
  const eventMap = React.useMemo(() => eventsByDay(events), [events]);

  // Keep the roving cursor inside the visible days when the period changes
  // from outside (a prop change, not our own keyboard navigation).
  const effectiveCursor = flatDays.includes(cursor)
    ? cursor
    : flatDays.includes(anchorDate)
      ? anchorDate
      : flatDays[0];

  React.useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    rootRef.current
      ?.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')
      ?.focus({ preventScroll: true });
  });

  function disabledDay(isoDate: string): boolean {
    if (minDate && isoDate < minDate) return true;
    if (maxDate && isoDate > maxDate) return true;
    return isDisabled?.(isoDate) ?? false;
  }

  function pick(isoDate: string): void {
    if (disabledDay(isoDate)) return;
    setSelectedDate(isoDate);
    onDayClick?.(isoDate);
  }

  function announce(nextView: CalendarView, nextAnchor: string): void {
    if (!labels?.periodAnnouncement) return;
    const [start, end] = periodRange(nextView, nextAnchor, firstDayOfWeek);
    setStatusMessage(labels.periodAnnouncement(nextView, start, end));
  }

  function navigateTo(nextAnchor: string, nextView: CalendarView = view): void {
    setAnchorDate(nextAnchor);
    const [start, end] = periodRange(nextView, nextAnchor, firstDayOfWeek);
    onNavigate?.(nextView, start, end);
    announce(nextView, nextAnchor);
  }

  function stepView(delta: 1 | -1): void {
    if (view === "week") navigateTo(addDays(anchorDate, delta * 7));
    else if (view === "four-week") navigateTo(addDays(anchorDate, delta * 28));
    else navigateTo(addMonths(anchorDate, delta));
  }

  function goToday(): void {
    if (today == null) return;
    navigateTo(today);
  }

  function changeView(next: CalendarView): void {
    setView(next);
    const [start, end] = periodRange(next, anchorDate, firstDayOfWeek);
    onNavigate?.(next, start, end);
    announce(next, anchorDate);
  }

  /** Move the cursor, re-paging the visible period when it leaves it. */
  function moveCursor(next: string): void {
    setCursor(next);
    if (view === "month") {
      const cp = parseIsoDate(next);
      const anchor = parseIsoDate(anchorDate);
      if (cp && anchor && (cp.year !== anchor.year || cp.month !== anchor.month)) {
        navigateTo(formatIsoDate({ year: cp.year, month: cp.month, day: 1 }));
      }
    } else {
      const len = view === "week" ? 7 : 28;
      let start = weekStart(anchorDate, firstDayOfWeek);
      if (next < start) {
        while (next < start) start = addDays(start, -7);
        navigateTo(start);
      } else {
        let end = addDays(start, len - 1);
        if (next > end) {
          while (next > end) {
            start = addDays(start, 7);
            end = addDays(start, len - 1);
          }
          navigateTo(start);
        }
      }
    }
    focusPending.current = true;
  }

  function pageCursor(delta: 1 | -1): void {
    if (view === "week") moveCursor(addDays(effectiveCursor, delta * 7));
    else if (view === "four-week") moveCursor(addDays(effectiveCursor, delta * 28));
    else moveCursor(addMonths(effectiveCursor, delta));
  }

  function onGridKeyDown(event: React.KeyboardEvent): void {
    const offset = (weekdayOf(effectiveCursor) - firstDayOfWeek + 7) % 7;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveCursor(addDays(effectiveCursor, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        moveCursor(addDays(effectiveCursor, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        moveCursor(addDays(effectiveCursor, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        moveCursor(addDays(effectiveCursor, 7));
        break;
      case "Home":
        event.preventDefault();
        moveCursor(addDays(effectiveCursor, -offset));
        break;
      case "End":
        event.preventDefault();
        moveCursor(addDays(effectiveCursor, 6 - offset));
        break;
      case "PageUp":
        event.preventDefault();
        pageCursor(-1);
        break;
      case "PageDown":
        event.preventDefault();
        pageCursor(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        pick(effectiveCursor);
        break;
      case "t":
      case "T":
        if (today == null || event.ctrlKey || event.metaKey || event.altKey) break;
        event.preventDefault();
        navigateTo(today);
        moveCursor(today);
        break;
    }
  }

  function onDayCellClick(isoDate: string): void {
    setCursor(isoDate);
    pick(isoDate);
  }

  const openEvent = (calendarEvent: CalendarEvent) => onEventClick?.(calendarEvent);

  return (
    <div
      ref={rootRef}
      className={`calendar-view ${className}`.trim()}
      {...restProps}
    >
      {(labels?.weekView || labels?.fourWeekView || labels?.monthView) && (
        <div className="calendar-view-toolbar">
          <div className="calendar-view-switcher" role="group">
            {labels?.weekView && (
              <button
                type="button"
                className="calendar-view-switcher-button calendar-view-switcher-button-week"
                aria-pressed={view === "week"}
                onClick={() => changeView("week")}
              >
                {labels.weekView}
              </button>
            )}
            {labels?.fourWeekView && (
              <button
                type="button"
                className="calendar-view-switcher-button calendar-view-switcher-button-four-week"
                aria-pressed={view === "four-week"}
                onClick={() => changeView("four-week")}
              >
                {labels.fourWeekView}
              </button>
            )}
            {labels?.monthView && (
              <button
                type="button"
                className="calendar-view-switcher-button calendar-view-switcher-button-month"
                aria-pressed={view === "month"}
                onClick={() => changeView("month")}
              >
                {labels.monthView}
              </button>
            )}
          </div>
          <div className="calendar-view-nav">
            <button
              type="button"
              className="calendar-view-previous-button"
              aria-label={labels?.previous?.(view)}
              onClick={() => stepView(-1)}
            >
              ‹
            </button>
            {labels?.today && (
              <button
                type="button"
                className="calendar-view-today-button"
                disabled={today == null}
                onClick={goToday}
              >
                {labels.today}
              </button>
            )}
            <button
              type="button"
              className="calendar-view-next-button"
              aria-label={labels?.next?.(view)}
              onClick={() => stepView(1)}
            >
              ›
            </button>
          </div>
        </div>
      )}

      <CalendarTable label={label} className="calendar-view-table" onKeyDown={onGridKeyDown}>
        <CalendarTableHead>
          <CalendarTableRow>
            {Array.from({ length: 7 }, (_, i) => {
              const weekday = (firstDayOfWeek + i) % 7;
              return (
                <CalendarTableTH key={i} scope="col">
                  {labels?.weekdayAbbr ? (
                    <abbr title={labels.weekday?.(weekday) ?? labels.weekdayAbbr(weekday)}>
                      {labels.weekdayAbbr(weekday)}
                    </abbr>
                  ) : labels?.weekday ? (
                    labels.weekday(weekday)
                  ) : null}
                </CalendarTableTH>
              );
            })}
          </CalendarTableRow>
        </CalendarTableHead>
        <CalendarTableBody>
          {days.map((week, rowIndex) => (
            <CalendarTableRow key={rowIndex}>
              {week.map((d) => {
                const weekday = weekdayOf(d);
                const outside = isOutsidePeriod(view, d, anchorDate);
                const isToday = today != null && d === today;
                const dayEvents = eventMap.get(d) ?? [];
                const disabled = disabledDay(d);
                const picked = selectedDate === d;
                return (
                  <CalendarTableTD
                    key={d}
                    selected={d === effectiveCursor}
                    today={isToday}
                    data-date={d}
                    data-outside-period={outside ? "" : undefined}
                    data-selected={picked ? "" : undefined}
                    data-disabled={disabled ? "" : undefined}
                    aria-disabled={disabled || undefined}
                    aria-label={labels?.day?.(d, weekday, outside)}
                    onClick={() => onDayCellClick(d)}
                  >
                    {day
                      ? day({
                          date: d,
                          events: dayEvents,
                          isToday,
                          outsidePeriod: outside,
                          selected: picked,
                          disabled,
                          openEvent,
                        })
                      : parseIsoDate(d)?.day}
                  </CalendarTableTD>
                );
              })}
            </CalendarTableRow>
          ))}
        </CalendarTableBody>
      </CalendarTable>

      <div className="calendar-view-status" aria-live="polite">
        {statusMessage}
      </div>
    </div>
  );
}

export default CalendarView;
