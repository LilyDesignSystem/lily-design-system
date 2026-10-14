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
  isoWeek,
  monthMatrix,
  parseIsoDate,
  weekdayOf,
} from "@lilydesignsystem/react-date-time-picker";

export type CalendarView = "week" | "four-week" | "month";

/** A marked range (a holiday, a closure, a school term). `label` is text a `day` render prop can show. */
export type CalendarRange = { start: string; end: string; kind?: string; label?: string };

/** The user's picked range, inclusive. */
export type SelectedRange = { start: string; end: string };

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
  /** Visible text for the week-number column header (e.g. "Wk"). */
  weekNumberHeader?: string;
  /** Accessible name for a week-number cell (e.g. "Week 3"). Without it the bare number is the name. */
  weekNumber?: (week: number) => string;
  /** Announced as a range is extended with Shift+arrows or confirmed. */
  rangeAnnouncement?: (start: string, end: string) => string;
};

export type DayArgs = {
  date: string;
  events: CalendarEvent[];
  isToday: boolean;
  outsidePeriod: boolean;
  selected: boolean;
  disabled: boolean;
  /** Inside the picked range. */
  inRange: boolean;
  /** The marked ranges this day falls in. */
  ranges: CalendarRange[];
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
  /** Show an ISO week-number column (a row header per week). */
  showWeekNumbers?: boolean;
  /** Marked ranges (holidays, closures): each day inside gets `data-range="{kind}"`. */
  ranges?: CalendarRange[];
  /** The picked range. Controlled when given. Shift+arrows extend it from the cursor; Shift+click picks one; Escape clears it. */
  selectedRange?: SelectedRange;
  defaultSelectedRange?: SelectedRange;
  onSelectedRangeChange?: (selectedRange: SelectedRange | undefined) => void;
  /** Fired when a range is confirmed: Enter on an extended range, or Shift+click. */
  onRangeSelect?: (start: string, end: string) => void;
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
  showWeekNumbers = false,
  ranges = [],
  selectedRange: selectedRangeProp,
  defaultSelectedRange,
  onSelectedRangeChange,
  onRangeSelect,
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

  const [selectedRange, setSelectedRange] = useControllable<SelectedRange | undefined>(
    selectedRangeProp,
    defaultSelectedRange,
    onSelectedRangeChange,
  );
  /** Where Shift+arrows started extending from; null when not extending. */
  const rangeAnchor = React.useRef<string | null>(null);

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

  function setRange(a: string, b: string): void {
    const [start, end] = a <= b ? [a, b] : [b, a];
    setSelectedRange({ start, end });
    const message = labels?.rangeAnnouncement?.(start, end);
    if (message) setStatusMessage(message);
  }

  function confirmRange(range: SelectedRange): void {
    rangeAnchor.current = null;
    onRangeSelect?.(range.start, range.end);
  }

  const inSelectedRange = (isoDate: string) =>
    !!selectedRange && isoDate >= selectedRange.start && isoDate <= selectedRange.end;

  const rangesFor = (isoDate: string) => ranges.filter((r) => isoDate >= r.start && isoDate <= r.end);

  /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
  function weekNumberOf(row: string[]): number {
    return isoWeek(row.find((d) => weekdayOf(d) === 4) ?? row[0]);
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

  function pagedCursor(delta: 1 | -1): string {
    if (view === "week") return addDays(effectiveCursor, delta * 7);
    if (view === "four-week") return addDays(effectiveCursor, delta * 28);
    return addMonths(effectiveCursor, delta);
  }

  function pageCursor(delta: 1 | -1): void {
    if (view === "week") moveCursor(addDays(effectiveCursor, delta * 7));
    else if (view === "four-week") moveCursor(addDays(effectiveCursor, delta * 28));
    else moveCursor(addMonths(effectiveCursor, delta));
  }

  const MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

  function onGridKeyDown(event: React.KeyboardEvent): void {
    const offset = (weekdayOf(effectiveCursor) - firstDayOfWeek + 7) % 7;
    const extending = event.shiftKey && MOVE_KEYS.has(event.key);
    let extendTo: string | null = null;
    if (extending && rangeAnchor.current === null) {
      rangeAnchor.current = selectedDate && !selectedRange ? selectedDate : effectiveCursor;
    }
    if (!extending && MOVE_KEYS.has(event.key)) rangeAnchor.current = null;
    const move = (next: string) => {
      if (extending) extendTo = next;
      moveCursor(next);
    };
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        move(addDays(effectiveCursor, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        move(addDays(effectiveCursor, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        move(addDays(effectiveCursor, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        move(addDays(effectiveCursor, 7));
        break;
      case "Home":
        event.preventDefault();
        move(addDays(effectiveCursor, -offset));
        break;
      case "End":
        event.preventDefault();
        move(addDays(effectiveCursor, 6 - offset));
        break;
      case "PageUp":
        event.preventDefault();
        if (extending) extendTo = pagedCursor(-1);
        pageCursor(-1);
        break;
      case "PageDown":
        event.preventDefault();
        if (extending) extendTo = pagedCursor(1);
        pageCursor(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (rangeAnchor.current !== null && selectedRange) confirmRange(selectedRange);
        else pick(effectiveCursor);
        break;
      case "Escape":
        if (selectedRange || rangeAnchor.current !== null) {
          event.preventDefault();
          rangeAnchor.current = null;
          setSelectedRange(undefined);
        }
        break;
      case "t":
      case "T":
        if (today == null || event.ctrlKey || event.metaKey || event.altKey) break;
        event.preventDefault();
        navigateTo(today);
        moveCursor(today);
        break;
    }
    if (extending && extendTo !== null && rangeAnchor.current !== null) setRange(rangeAnchor.current, extendTo);
  }

  function onDayCellClick(isoDate: string, event: React.MouseEvent): void {
    if (event.shiftKey && !disabledDay(isoDate)) {
      // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
      const a = selectedDate && !selectedRange ? selectedDate : effectiveCursor;
      const [start, end] = a <= isoDate ? [a, isoDate] : [isoDate, a];
      setRange(a, isoDate);
      setCursor(isoDate);
      confirmRange({ start, end });
      return;
    }
    setCursor(isoDate);
    rangeAnchor.current = null;
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
            {showWeekNumbers && (
              <CalendarTableTH scope="col" data-week-number-header="">
                {labels?.weekNumberHeader ?? ""}
              </CalendarTableTH>
            )}
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
              {showWeekNumbers && (
                <CalendarTableTH
                  scope="row"
                  data-week-number={weekNumberOf(week)}
                  aria-label={labels?.weekNumber?.(weekNumberOf(week))}
                >
                  {weekNumberOf(week)}
                </CalendarTableTH>
              )}
              {week.map((d) => {
                const weekday = weekdayOf(d);
                const outside = isOutsidePeriod(view, d, anchorDate);
                const isToday = today != null && d === today;
                const dayEvents = eventMap.get(d) ?? [];
                const disabled = disabledDay(d);
                const picked = selectedDate === d;
                const inRange = inSelectedRange(d);
                const dayRanges = rangesFor(d);
                return (
                  <CalendarTableTD
                    key={d}
                    selected={d === effectiveCursor}
                    today={isToday}
                    data-date={d}
                    data-outside-period={outside ? "" : undefined}
                    data-selected={picked ? "" : undefined}
                    data-disabled={disabled ? "" : undefined}
                    data-in-range={inRange ? "" : undefined}
                    data-range-start={selectedRange?.start === d ? "" : undefined}
                    data-range-end={selectedRange?.end === d ? "" : undefined}
                    data-range={
                      dayRanges.length ? dayRanges.map((r) => r.kind ?? "range").join(" ") : undefined
                    }
                    aria-disabled={disabled || undefined}
                    aria-label={labels?.day?.(d, weekday, outside)}
                    onClick={(e: React.MouseEvent) => onDayCellClick(d, e)}
                  >
                    {day
                      ? day({
                          date: d,
                          events: dayEvents,
                          isToday,
                          outsidePeriod: outside,
                          selected: picked,
                          disabled,
                          inRange,
                          ranges: dayRanges,
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
