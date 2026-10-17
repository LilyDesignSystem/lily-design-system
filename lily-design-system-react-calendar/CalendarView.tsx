import * as React from "react";
import {
  CalendarTable,
  CalendarTableBody,
  CalendarTableHead,
  CalendarTableRow,
  CalendarTableTD,
  CalendarTableTH,
  Mark,
  SearchInput,
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
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data";
import { civilDateToDate } from "./cell-types";
import { highlightSegments, matchesSearch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import {
  draftOf,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText as fieldTextOf,
  editorKind,
  isEditableField,
  neighbourField,
  resolveFields,
  type Draft,
  type FieldDef,
  type ResolvedField,
} from "./typed-fields";

/**
 * A typed field an event carries (a room, a status, a cost), shown after the event's title in the agenda and read from
 * `event.values[id]`. A bundle of display, sort and export defaults from the data grid's cell types.
 */
export type CalendarEventField = FieldDef;

/** What `onExport` receives. Return `false` to take over the download. */
export type CalendarExport = { format: ExportFormat; filename: string; eventCount: number; blob: Blob };

/** What `onFieldEdit` receives. */
export type CalendarFieldEdit = { eventId: string; fieldId: string; value: unknown; previous: unknown };

export type CalendarView = "day" | "week" | "four-week" | "month" | "agenda";

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
  /** Values of the calendar's `eventFields`, by field id. */
  values?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Every field is optional, but its presence gates the control it names —
 * no baked-in English fallback. See spec/index.md §5.
 */
export type CalendarViewLabels = {
  /** Switcher label for the one-day view. Gates its button. */
  dayView?: string;
  weekView?: string;
  fourWeekView?: string;
  monthView?: string;
  /** Switcher label for the agenda (list) view of the month. Gates its button. */
  agendaView?: string;
  /** Agenda view: the message when the shown month has no events (and `agendaEmptyDays` is off). Gates the message. */
  agendaEmpty?: string;
  previous?: (view: CalendarView) => string;
  next?: (view: CalendarView) => string;
  today?: string;
  periodAnnouncement?: (view: CalendarView, start: string, end: string) => string;
  /** Announced when navigation stops at `minDate` or `maxDate`: (which limit, that date). Without it a stopped Previous / Next / Page key is silent. */
  rangeLimit?: (limit: "min" | "max", date: string) => string;
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
  /** Announced after an event is moved to another day. */
  eventMoveAnnouncement?: (calendarEvent: CalendarEvent, toDate: string) => string;
  /** Visible title of the shown period, rendered between the previous and next buttons. Gates the title. */
  periodTitle?: (view: CalendarView, start: string, end: string) => string;
  /** Accessible name of the export button group. Gates the group (with at least one of the three buttons). */
  export?: string;
  /** Visible text of the CSV, TSV and Excel export buttons. Each gates its button. */
  exportCsv?: string;
  exportTsv?: string;
  exportExcel?: string;
  /** Announced after an export: (format, how many events, file name). */
  exportAnnouncement?: (format: ExportFormat, eventCount: number, filename: string) => string;
  /** Visible text of the copy button, which puts the export (header row first, tab-separated) on the clipboard for pasting into a spreadsheet. Gates the button (with `exportHeaders`). */
  copy?: string;
  /** Announced after a copy: (how many rows). */
  copyAnnouncement?: (rowCount: number) => string;
  /** Announced when the clipboard could not be written. */
  copyFailed?: string;
  /** Headers of the export's own columns. An export needs `exportHeaders`; there is no English default. */
  exportHeaders?: { title: string; start: string; end: string };
  /** Announced after a field edit: (event title, field header, the new text). */
  editAnnouncement?: (eventTitle: string, fieldHeader: string, text: string) => string;
  /** Announced when an edit is refused as invalid for the field's type: (event title, field header). */
  editInvalid?: (eventTitle: string, fieldHeader: string) => string;
  /** Announced when a field's `validate` refuses a value: (event title, field header, the reason). Falls back to `editInvalid`. */
  editRefused?: (eventTitle: string, fieldHeader: string, message: string) => string;
  /** Announced after Ctrl/Cmd+Z puts an earlier value back: (event title, field header, the restored text). */
  undoAnnouncement?: (eventTitle: string, fieldHeader: string, text: string) => string;
  /** Announced after Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies an edit: (event title, field header, the text). */
  redoAnnouncement?: (eventTitle: string, fieldHeader: string, text: string) => string;
  /** Accessible name of the search field. Gates the field. */
  search?: string;
  /** Announced after the search changes: (matching events, all events). */
  searchAnnouncement?: (matchCount: number, totalCount: number) => string;
};

export type DayArgs = {
  date: string;
  events: CalendarEvent[];
  /** The first `maxEvents` events (all of them without the cap). */
  visibleEvents: CalendarEvent[];
  /** How many events the cap hides, for a "+N more" control. */
  hiddenCount: number;
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
  /** The formatted text of one event's typed field (empty when the event has no value for it). For a `day` render prop that shows fields. */
  fieldText: (calendarEvent: CalendarEvent, fieldId: string) => string;
  /** Spread onto an event's element to make it draggable and keyboard-movable: `{...eventProps(ev)}`. Empty without `onEventMove`. */
  eventProps: (calendarEvent: CalendarEvent) => React.HTMLAttributes<HTMLElement> & Record<string, unknown>;
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
  /** Search: shows only the events whose text contains every word of it (any order, ignoring case and diacritics), in every view; the agenda wraps matches in `<mark class="calendar-view-match">`. Exports hold what the search leaves. Escape in the field clears it. Controlled when given. Needs `labels.search` for the field; the prop works without. */
  search?: string;
  /** Initial search when uncontrolled. */
  defaultSearch?: string;
  /** Called with the new search after every change. */
  onSearchChange?: (search: string) => void;
  /** Hides events for which it returns false (a category, owner or status filter). Combines with `search`; both must pass. */
  filter?: (event: CalendarEvent) => boolean;
  /** Orders the events within a day (and so in the agenda). Stable. Without it events keep the order of `events`. */
  eventCompare?: (a: CalendarEvent, b: CalendarEvent) => number;
  /** The text `search` looks in. Defaults to the event's title and every field's text. */
  searchText?: (event: CalendarEvent) => string;
  /** Show the agenda on a narrow screen: a viewport narrower than this many pixels (for example `640`) reads as the agenda view, and goes back to `view` when it is wider. A view the user picks with the switcher is respected. Needs `matchMedia`; without it nothing changes. */
  agendaBelow?: number;
  /** Agenda view: show the date beside each day's events (default `true`). `false` hides it visually, keeping it for screen readers (a `<time>` with a `datetime`), for a layout that shows its own date. */
  agendaDate?: boolean;
  /** Agenda view: also list days with no events. Default false (only days with events). */
  agendaEmptyDays?: boolean;
  /** Cap on events shown per day: the `day` render prop gets `visibleEvents` and `hiddenCount`. */
  maxEvents?: number;
  /** Called when an event is moved to another day, by drag-and-drop or Alt+arrow keys on a focused event element. Setting it turns the drag-and-drop on. */
  onEventMove?: (calendarEvent: CalendarEvent, toDate: string) => void;
  /** Month view: leave days outside the shown month empty (the cell keeps `data-outside-period`). */
  hideOutsideDays?: boolean;
  /** Weekday numbers (0 = Sunday … 6 = Saturday) that are the weekend; those cells get `data-weekend`. */
  weekendDays?: number[];
  /** `"multiple"`: Enter/Space or a click toggles a day in `selectedDates` instead of setting `selectedDate`. */
  selectionMode?: "single" | "multiple";
  /** The picked days in `"multiple"` mode. Controlled when given. */
  selectedDates?: string[];
  defaultSelectedDates?: string[];
  onSelectedDatesChange?: (selectedDates: string[]) => void;
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
  /** Typed event fields, read from `event.values`. The default agenda shows them after each event's title; a `day` render prop gets `fieldText`. Editable types edit in the agenda (click the value; Tab moves to the next). */
  eventFields?: CalendarEventField[];
  /** Called with each accepted field edit. The consumer updates `events`. A field is editable only when this is set. */
  onFieldEdit?: (edit: CalendarFieldEdit) => void;
  /** Base of an export's file name (`.csv`, `.tsv` or `.xlsx` is added). Default `"calendar"`. */
  exportFilename?: string;
  /** What an export holds: `"period"` (default) is the events that touch the shown period; `"all"` is every event. */
  exportScope?: "period" | "all";
  /** Called before the download with the finished file. Return `false` to skip the built-in download. */
  onExport?: (info: CalendarExport) => boolean | void;
  /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). */
  onCopy?: (copy: { text: string; rowCount: number }) => boolean | void;
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
  if (view === "agenda") return [];
  if (view === "month") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [];
    return monthMatrix(parsed.year, parsed.month, firstDayOfWeek);
  }
  if (view === "day") return [[anchorDate]];
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
  if (view === "month" || view === "agenda") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [anchorDate, anchorDate];
    return [
      formatIsoDate({ ...parsed, day: 1 }),
      formatIsoDate({ ...parsed, day: daysInMonth(parsed.year, parsed.month) }),
    ];
  }
  if (view === "day") return [anchorDate, anchorDate];
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
  events: allEvents = [],
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  searchText,
  filter,
  eventCompare,
  agendaBelow,
  agendaDate = true,
  maxEvents,
  agendaEmptyDays = false,
  onEventMove,
  hideOutsideDays = false,
  weekendDays,
  selectionMode = "single",
  selectedDates: selectedDatesProp,
  defaultSelectedDates,
  onSelectedDatesChange,
  today,
  minDate,
  maxDate,
  isDisabled,
  locale,
  labels,
  onNavigate,
  onDayClick,
  onEventClick,
  eventFields,
  onFieldEdit,
  exportFilename: exportBase = "calendar",
  exportScope = "period",
  onExport,
  onCopy,
  day,
  className = "",
  ...restProps
}: Props): React.ReactElement {
  const [viewState, setView] = useControllable<CalendarView>(viewProp, defaultView, onViewChange);
  // A narrow screen shows the agenda: with `agendaBelow` set, a viewport narrower than that many pixels reads as the agenda view
  // (the `view` prop is untouched, so a wide screen goes back to it). A view the user picks on purpose is respected.
  const [narrow, setNarrow] = React.useState(false);
  const [pickedOnPurpose, setPickedOnPurpose] = React.useState(false);
  const view: CalendarView = narrow && !pickedOnPurpose ? "agenda" : viewState;
  React.useEffect(() => {
    if (agendaBelow === undefined || typeof matchMedia !== "function") {
      setNarrow(false);
      return;
    }
    const query = matchMedia(`(max-width: ${agendaBelow - 1}px)`);
    const update = () => {
      setNarrow(query.matches);
      if (!query.matches) setPickedOnPurpose(false);
    };
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, [agendaBelow]);
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
  const [selectedDates, setSelectedDates] = useControllable<string[]>(
    selectedDatesProp,
    defaultSelectedDates ?? [],
    onSelectedDatesChange,
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
  // Type defaults (format, compare, export value) resolved once per `eventFields` / `locale` change, never per event or keystroke.
  const resolvedFields = React.useMemo(() => resolveFields(eventFields, locale), [eventFields, locale]);
  const [searchInner, setSearchInner] = React.useState(defaultSearch);
  const search = searchProp ?? searchInner;
  const searching = search.trim() !== "";
  const defaultSearchText = (e: CalendarEvent): string =>
    [typeof e.title === "string" ? e.title : e.id, ...resolvedFields.map((f) => fieldTextOf(f, e.values))].join(" ");
  /** The events the search leaves (all of them without one), found once per query / event change. */
  const events = React.useMemo(() => {
    const narrowed =
      searching || filter
        ? allEvents.filter((e) => (!filter || filter(e)) && (!searching || matchesSearch((searchText ?? defaultSearchText)(e), search)))
        : allEvents;
    return eventCompare ? [...narrowed].sort(eventCompare) : narrowed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents, search, filter, searchText, eventCompare, resolvedFields, searching]);
  // Announce how many events match after the search changes (not on the first render).
  const searchAnnouncedRef = React.useRef(false);
  React.useEffect(() => {
    if (!searchAnnouncedRef.current) {
      searchAnnouncedRef.current = true;
      return;
    }
    const message = labels?.searchAnnouncement?.(events.length, allEvents.length);
    if (message) setStatusMessage(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  const eventMap = React.useMemo(() => eventsByDay(events), [events]);

  // Agenda: the days of the shown month that have events (all of them with `agendaEmptyDays`).
  const agendaDays: string[] = [];
  if (view === "agenda") {
    const [start, end] = periodRange("agenda", anchorDate, firstDayOfWeek);
    for (let d = start; d <= end; d = addDays(d, 1)) {
      if (agendaEmptyDays || (eventMap.get(d)?.length ?? 0) > 0) agendaDays.push(d);
    }
  }

  // Keep the roving cursor inside the visible days when the period changes
  // from outside (a prop change, not our own keyboard navigation).
  const effectiveCursor = flatDays.includes(cursor)
    ? cursor
    : flatDays.includes(anchorDate)
      ? anchorDate
      : flatDays[0];

  const pendingFieldFocus = React.useRef<{ kind: "editor" } | { kind: "field"; eventId: string; fieldId: string } | null>(null);
  const baseId = React.useId();

  React.useEffect(() => {
    const pendingField = pendingFieldFocus.current;
    if (pendingField) {
      pendingFieldFocus.current = null;
      const root = rootRef.current;
      if (pendingField.kind === "editor") {
        const editor = root?.querySelector<HTMLInputElement>(".calendar-view-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
      } else {
        const li = Array.from(root?.querySelectorAll<HTMLElement>("[data-event-key]") ?? []).find((el) => el.dataset.eventKey === pendingField.eventId);
        const button = Array.from(li?.querySelectorAll<HTMLElement>("[data-field]") ?? []).find((el) => el.dataset.field === pendingField.fieldId);
        button?.querySelector<HTMLElement>(".calendar-view-field-button")?.focus({ preventScroll: true });
      }
    }
    if (!focusPending.current) return;
    focusPending.current = false;
    rootRef.current
      ?.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')
      ?.focus({ preventScroll: true });
  });

  /** The labels of the ranges a day is in, joined for a cell's description; undefined when none has one. */
  const rangeLabels = (dayRanges: CalendarRange[]): string | undefined => {
    const text = dayRanges.map((r) => r.label).filter((l): l is string => !!l).join(", ");
    return text === "" ? undefined : text;
  };

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

  // The marked ranges per visible day, found once per `ranges` / period change rather than once per cell per render.
  const rangesByDay = React.useMemo(() => {
    const map = new Map<string, CalendarRange[]>();
    if (ranges.length === 0) return map;
    const shown = view === "agenda" ? agendaDays : flatDays;
    for (const d of shown) {
      const hit = ranges.filter((r) => d >= r.start && d <= r.end);
      if (hit.length > 0) map.set(d, hit);
    }
    return map;
  }, [ranges, view, agendaDays.join(","), flatDays.join(",")]);
  const NO_RANGES: CalendarRange[] = [];
  const rangesFor = (isoDate: string) => rangesByDay.get(isoDate) ?? NO_RANGES;
  const selectedDateSet = React.useMemo(() => new Set(selectedDates), [selectedDates]);
  const eventById = React.useMemo(() => new Map(allEvents.map((e) => [e.id, e])), [allEvents]);

  /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
  function weekNumberOf(row: string[]): number {
    return isoWeek(row.find((d) => weekdayOf(d) === 4) ?? row[0]);
  }

  function pick(isoDate: string): void {
    if (disabledDay(isoDate)) return;
    if (selectionMode === "multiple") {
      setSelectedDates(
        selectedDates.includes(isoDate)
          ? selectedDates.filter((d) => d !== isoDate)
          : [...selectedDates, isoDate].sort(),
      );
    } else {
      setSelectedDate(isoDate);
    }
    onDayClick?.(isoDate);
  }

  // minDate / maxDate bound navigation as well as picking.
  const periodStart = periodRange(view, anchorDate, firstDayOfWeek)[0];
  const periodEnd = periodRange(view, anchorDate, firstDayOfWeek)[1];
  const atMinLimit = !!minDate && periodStart <= minDate;
  const atMaxLimit = !!maxDate && periodEnd >= maxDate;
  const todayOutOfRange = today == null || (!!minDate && today < minDate) || (!!maxDate && today > maxDate);
  const clampDate = (isoDate: string): string => (minDate && isoDate < minDate ? minDate : maxDate && isoDate > maxDate ? maxDate : isoDate);
  function announceLimit(limit: "min" | "max"): void {
    const date = limit === "min" ? minDate : maxDate;
    const message = date ? labels?.rangeLimit?.(limit, date) : undefined;
    if (message) setStatusMessage(message);
  }

  // The period is announced whenever it changes, whatever changed it: Previous / Next / Today, a view switch, a keyboard move
  // across the edge, or the consumer setting `anchorDate` or `view`. The first render says nothing.
  const announcedPeriod = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    const key = `${view}|${periodStart}|${periodEnd}`;
    if (announcedPeriod.current === undefined) {
      announcedPeriod.current = key;
      return;
    }
    if (key === announcedPeriod.current) return;
    announcedPeriod.current = key;
    if (labels?.periodAnnouncement) setStatusMessage(labels.periodAnnouncement(view, periodStart, periodEnd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, periodStart, periodEnd]);

  function navigateTo(nextAnchor: string, nextView: CalendarView = view): void {
    setAnchorDate(nextAnchor);
    const [start, end] = periodRange(nextView, nextAnchor, firstDayOfWeek);
    onNavigate?.(nextView, start, end);
  }

  function stepView(delta: 1 | -1): void {
    if (delta < 0 && atMinLimit) return announceLimit("min");
    if (delta > 0 && atMaxLimit) return announceLimit("max");
    if (view === "day") navigateTo(addDays(anchorDate, delta));
    else if (view === "week") navigateTo(addDays(anchorDate, delta * 7));
    else if (view === "four-week") navigateTo(addDays(anchorDate, delta * 28));
    else navigateTo(addMonths(anchorDate, delta));
  }

  function goToday(): void {
    if (today == null || todayOutOfRange) return;
    navigateTo(today);
  }

  function changeView(next: CalendarView): void {
    setView(next);
    setPickedOnPurpose(true);
    const [start, end] = periodRange(next, anchorDate, firstDayOfWeek);
    onNavigate?.(next, start, end);
  }

  /** Move the cursor, re-paging the visible period when it leaves it. */
  function moveCursor(requested: string): void {
    const next = clampDate(requested);
    if (next !== requested) announceLimit(requested < next ? "min" : "max");
    setCursor(next);
    if (view === "month") {
      const cp = parseIsoDate(next);
      const anchor = parseIsoDate(anchorDate);
      if (cp && anchor && (cp.year !== anchor.year || cp.month !== anchor.month)) {
        navigateTo(formatIsoDate({ year: cp.year, month: cp.month, day: 1 }));
      }
    } else if (view === "day") {
      if (next !== anchorDate) navigateTo(next);
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
    if (view === "day") return addDays(effectiveCursor, delta);
    if (view === "week") return addDays(effectiveCursor, delta * 7);
    if (view === "four-week") return addDays(effectiveCursor, delta * 28);
    return addMonths(effectiveCursor, delta);
  }

  function pageCursor(delta: 1 | -1): void {
    if (view === "day") moveCursor(addDays(effectiveCursor, delta));
    else if (view === "week") moveCursor(addDays(effectiveCursor, delta * 7));
    else if (view === "four-week") moveCursor(addDays(effectiveCursor, delta * 28));
    else moveCursor(addMonths(effectiveCursor, delta));
  }

  const MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

  // ---- Event drag-and-drop (supplementary pointer path) + Alt+arrow keys ----
  const draggingEventId = React.useRef<string | null>(null);

  function eventProps(calendarEvent: CalendarEvent): React.HTMLAttributes<HTMLElement> & Record<string, unknown> {
    if (!onEventMove) return {};
    return {
      draggable: true,
      "data-event-id": calendarEvent.id,
      onDragStart: (e: React.DragEvent) => {
        draggingEventId.current = calendarEvent.id;
        e.dataTransfer?.setData("text/plain", calendarEvent.id);
      },
    };
  }

  function moveEventTo(calendarEvent: CalendarEvent, toDate: string): void {
    if (!onEventMove || disabledDay(toDate)) return;
    onEventMove(calendarEvent, toDate);
    const message = labels?.eventMoveAnnouncement?.(calendarEvent, toDate);
    if (message) setStatusMessage(message);
  }

  function onDayDrop(isoDate: string, event: React.DragEvent): void {
    event.preventDefault();
    const id = draggingEventId.current ?? event.dataTransfer?.getData("text/plain");
    draggingEventId.current = null;
    const calendarEvent = id ? eventById.get(id) : undefined;
    if (calendarEvent) moveEventTo(calendarEvent, isoDate);
  }

  function onGridKeyDown(event: React.KeyboardEvent): void {
    // The horizontal arrows are visual: in a right-to-left layout the next day is on the left, so ArrowLeft goes forward.
    const key = logicalKey(event.key, isRtl(event.target as Element));
    if (onEventMove && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
      const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset.date;
      const calendarEvent = el?.dataset.eventId ? eventById.get(el.dataset.eventId) : undefined;
      if (el && fromDate && calendarEvent) {
        event.preventDefault();
        const week = view === "day" ? 1 : 7;
        const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[key]!;
        moveEventTo(calendarEvent, addDays(fromDate, delta));
        return;
      }
    }
    const offset = view === "day" ? 0 : (weekdayOf(effectiveCursor) - firstDayOfWeek + 7) % 7;
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
    switch (key) {
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
        move(addDays(effectiveCursor, view === "day" ? -1 : -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        move(addDays(effectiveCursor, view === "day" ? 1 : 7));
        break;
      case "Home":
        event.preventDefault();
        move(addDays(effectiveCursor, -offset));
        break;
      case "End":
        event.preventDefault();
        move(addDays(effectiveCursor, view === "day" ? 0 : 6 - offset));
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

  // ---------------------------------------------------------------
  // Typed fields, inline editing (agenda), export
  // ---------------------------------------------------------------

  const isFieldEditable = (f: CalendarEventField) => !!onFieldEdit && isEditableField(f);
  const eventFieldText = (f: ResolvedField, calendarEvent: CalendarEvent): string => fieldTextOf(f, calendarEvent.values);
  function fieldText(calendarEvent: CalendarEvent, fieldId: string): string {
    const f = resolvedFields.find((x) => x.id === fieldId);
    return f ? eventFieldText(f, calendarEvent) : "";
  }
  const eventTitle = (calendarEvent: CalendarEvent): string =>
    typeof calendarEvent.title === "string" ? calendarEvent.title : calendarEvent.id;

  /** The field being edited, if any: the draft is the editor's text. A ref mirrors it so a blur that lands in the same event as Enter sees it cleared. */
  type Editing = { eventId: string; fieldId: string; draft: Draft; invalid?: boolean };
  const [editing, setEditingState] = React.useState<Editing | null>(null);
  const editingRef = React.useRef<Editing | null>(null);
  function setEditing(next: Editing | null): void {
    editingRef.current = next;
    setEditingState(next);
  }

  function startFieldEdit(calendarEvent: CalendarEvent, f: ResolvedField): void {
    if (!isFieldEditable(f)) return;
    setEditing({ eventId: calendarEvent.id, fieldId: f.id, draft: draftOf(f, calendarEvent.values) });
    pendingFieldFocus.current = { kind: "editor" };
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  function commitFieldEdit(refocus = true): boolean {
    const current = editingRef.current;
    if (!current) return true;
    const { eventId, fieldId, draft } = current;
    const calendarEvent = eventById.get(eventId);
    const f = resolvedFields.find((x) => x.id === fieldId);
    if (!calendarEvent || !f) {
      setEditing(null);
      return true;
    }
    const outcome = evaluateEdit(f, calendarEvent.values, draft);
    if (outcome.invalid) {
      setEditing({ ...current, invalid: true });
      const message = (outcome.message ? labels?.editRefused?.(eventTitle(calendarEvent), f.header, outcome.message) : undefined) ?? labels?.editInvalid?.(eventTitle(calendarEvent), f.header);
      if (message) setStatusMessage(message);
      return false;
    }
    setEditing(null);
    if (outcome.changed) {
      historyRef.current = recordEdit(historyRef.current, { ownerId: eventId, fieldId, value: outcome.value, previous: outcome.previous });
      onFieldEdit?.({ eventId, fieldId, value: outcome.value, previous: outcome.previous });
      const message = labels?.editAnnouncement?.(eventTitle(calendarEvent), f.header, outcome.text);
      if (message) setStatusMessage(message);
    }
    if (refocus) pendingFieldFocus.current = { kind: "field", eventId, fieldId };
    return true;
  }

  function cancelFieldEdit(): void {
    const current = editingRef.current;
    if (!current) return;
    setEditing(null);
    pendingFieldFocus.current = { kind: "field", eventId: current.eventId, fieldId: current.fieldId };
  }

  /** Accepted field edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through `onFieldEdit` like any edit. */
  const historyRef = React.useRef<EditHistory>(EMPTY_HISTORY);

  /** Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (Ctrl+Y): put an earlier value back, or re-apply it, through `onFieldEdit`. */
  function stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(historyRef.current) : redoEdit(historyRef.current);
    if (!step.record) return;
    historyRef.current = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    onFieldEdit?.({ eventId: ownerId, fieldId, value: restored, previous: replaced });
    const calendarEvent = eventById.get(ownerId);
    const f = resolvedFields.find((x) => x.id === fieldId);
    if (!calendarEvent || !f) return;
    const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(calendarEvent.values ?? {}), [fieldId]: restored }) : String(restored);
    const message = (direction === "undo" ? labels?.undoAnnouncement : labels?.redoAnnouncement)?.(eventTitle(calendarEvent), f.header, text);
    if (message) setStatusMessage(message);
  }

  /** Undo / redo from anywhere in the calendar except inside a field editor (which keeps the browser's own undo). */
  function onRootKeyDown(event: React.KeyboardEvent): void {
    if (!onFieldEdit || (event.target as HTMLElement).closest(".calendar-view-field-editor, input, select, textarea")) return;
    const action = historyKey(event);
    if (!action) return;
    event.preventDefault();
    stepHistory(action);
  }

  function onFieldEditorKeyDown(event: React.KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      commitFieldEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelFieldEdit();
    } else if (event.key === "Tab" && editingRef.current) {
      // Tab commits and moves to the event's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const current = editingRef.current;
      const calendarEvent = eventById.get(current.eventId);
      const next = neighbourField(resolvedFields.filter(isFieldEditable), current.fieldId, event.shiftKey);
      if (calendarEvent && next) {
        event.preventDefault();
        if (commitFieldEdit(false)) startFieldEdit(calendarEvent, next);
      } else {
        commitFieldEdit(false);
      }
    }
  }

  /** The first and last day an event covers. */
  const eventSpan = (calendarEvent: CalendarEvent): { start: string; end: string } | null =>
    calendarEvent.date
      ? { start: calendarEvent.date, end: calendarEvent.date }
      : calendarEvent.start && calendarEvent.end
        ? { start: calendarEvent.start, end: calendarEvent.end }
        : null;

  const exportEvents = (() => {
    const dated = events.filter((e) => eventSpan(e) !== null);
    const kept =
      exportScope === "all"
        ? dated
        : dated.filter((e) => {
            const span = eventSpan(e)!;
            return span.start <= periodEnd && span.end >= periodStart;
          });
    return kept.sort((a, b) => eventSpan(a)!.start.localeCompare(eventSpan(b)!.start));
  })();
  const hasExportButtons = !!labels?.exportHeaders && !!(labels.copy || labels.exportCsv || labels.exportTsv || labels.exportExcel);
  const exportFieldList = exportableFields(resolvedFields);

  async function finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
    const text = toClipboardText(table);
    if (onCopy?.({ text, rowCount: table.rows.length }) === false) return;
    const ok = await copyToClipboard(text);
    const message = ok ? labels?.copyAnnouncement?.(table.rows.length) : labels?.copyFailed;
    if (message) setStatusMessage(message);
  }

  function runExport(format: ExportFormat | "copy"): void {
    const h = labels?.exportHeaders;
    if (!h) return;
    const headers = [h.title, h.start, h.end, ...exportFieldList.map((f) => f.header)];
    const body = exportEvents.map((calendarEvent) => {
      const span = eventSpan(calendarEvent)!;
      return [
        eventTitle(calendarEvent),
        civilDateToDate(span.start),
        civilDateToDate(span.end),
        ...exportFieldList.map((f) => exportFieldCell(f, calendarEvent.values)),
      ];
    });
    if (format === "copy") {
      void finishCopy({ headers, rows: body });
      return;
    }
    const filename = exportFilename(exportBase, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: exportBase });
    if (onExport?.({ format, filename, eventCount: body.length, blob }) === false) return;
    downloadBlob(blob, filename);
    const message = labels?.exportAnnouncement?.(format, body.length, filename);
    if (message) setStatusMessage(message);
  }


  return (
    <div
      ref={rootRef}
      className={`calendar-view ${className}`.trim()}
      onKeyDown={onRootKeyDown}
      {...restProps}
    >
      {(labels?.periodTitle || labels?.dayView || labels?.weekView || labels?.fourWeekView || labels?.monthView || labels?.agendaView) && (
        <div className="calendar-view-toolbar">
          <div className="calendar-view-switcher" role="group">
            {labels?.dayView && (
              <button
                type="button"
                className="calendar-view-switcher-button calendar-view-switcher-button-day"
                aria-pressed={view === "day"}
                onClick={() => changeView("day")}
              >
                {labels.dayView}
              </button>
            )}
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
            {labels?.agendaView && (
              <button
                type="button"
                className="calendar-view-switcher-button calendar-view-switcher-button-agenda"
                aria-pressed={view === "agenda"}
                onClick={() => changeView("agenda")}
              >
                {labels.agendaView}
              </button>
            )}
          </div>
          <div className="calendar-view-nav">
            <button
              type="button"
              className="calendar-view-previous-button"
              aria-label={labels?.previous?.(view)}
              aria-disabled={atMinLimit ? true : undefined}
              onClick={() => stepView(-1)}
            >
              ‹
            </button>
            {labels?.periodTitle && (
              <span className="calendar-view-title">{labels.periodTitle(view, periodStart, periodEnd)}</span>
            )}
            {labels?.today && (
              <button
                type="button"
                className="calendar-view-today-button"
                disabled={today == null}
                aria-disabled={today != null && todayOutOfRange ? true : undefined}
                onClick={goToday}
              >
                {labels.today}
              </button>
            )}
            <button
              type="button"
              className="calendar-view-next-button"
              aria-label={labels?.next?.(view)}
              aria-disabled={atMaxLimit ? true : undefined}
              onClick={() => stepView(1)}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {labels?.search && (
        <SearchInput
          className="calendar-view-search"
          label={labels.search}
          value={search}
          onChange={(next) => {
            setSearchInner(next);
            onSearchChange?.(next);
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Escape" && search !== "") {
              e.preventDefault();
              setSearchInner("");
              onSearchChange?.("");
            }
          }}
        />
      )}

      {hasExportButtons && (
        <div className="calendar-view-export" role="group" aria-label={labels?.export}>
          {labels?.copy && (
            <button type="button" className="calendar-view-export-button" data-calendar-export-format="copy" disabled={exportEvents.length === 0} onClick={() => runExport("copy")}>{labels.copy}</button>
          )}
          {labels?.exportCsv && (
            <button type="button" className="calendar-view-export-button" data-calendar-export-format="csv" disabled={exportEvents.length === 0} onClick={() => runExport("csv")}>{labels.exportCsv}</button>
          )}
          {labels?.exportTsv && (
            <button type="button" className="calendar-view-export-button" data-calendar-export-format="tsv" disabled={exportEvents.length === 0} onClick={() => runExport("tsv")}>{labels.exportTsv}</button>
          )}
          {labels?.exportExcel && (
            <button type="button" className="calendar-view-export-button" data-calendar-export-format="xlsx" disabled={exportEvents.length === 0} onClick={() => runExport("xlsx")}>{labels.exportExcel}</button>
          )}
        </div>
      )}

      {view === "agenda" ? (
        <>
          {/* The agenda is a plain list of days, not a grid: ordinary tab stops, no roving cursor. */}
          <ol className="calendar-view-agenda" aria-label={label}>
            {agendaDays.map((d) => {
              const weekday = weekdayOf(d);
              const dayEvents = eventMap.get(d) ?? [];
              const isToday = today != null && d === today;
              const dayRanges = rangesFor(d);
              const disabled = disabledDay(d);
              return (
                <li
                  key={d}
                  className="calendar-view-agenda-day"
                  data-date={d}
                  data-today={isToday ? "" : undefined}
                  data-weekend={weekendDays?.includes(weekday) ? "" : undefined}
                  data-range={dayRanges.length ? dayRanges.map((r) => r.kind ?? "range").join(" ") : undefined}
                  aria-current={isToday ? "date" : undefined}
                >
                  <time
                    className="calendar-view-agenda-date"
                    dateTime={d}
                    data-visually-hidden={agendaDate ? undefined : ""}
                    style={agendaDate ? undefined : { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
                  >
                    {labels?.day?.(d, weekday, false) ?? d}
                  </time>
                  {dayRanges.map((range) => range.label && (
                    <span key={range.start + range.end + (range.kind ?? "") + range.label} className="calendar-view-range-label">{range.label}</span>
                  ))}
                  {day ? (
                    day({
                      date: d,
                      events: dayEvents,
                      visibleEvents: maxEvents == null ? dayEvents : dayEvents.slice(0, Math.max(0, maxEvents)),
                      hiddenCount: maxEvents == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, maxEvents)),
                      isToday,
                      outsidePeriod: false,
                      selected: false,
                      disabled,
                      inRange: false,
                      ranges: dayRanges,
                      openEvent,
                      fieldText,
                      eventProps,
                    })
                  ) : dayEvents.length > 0 ? (
                    <ul className="calendar-view-agenda-events">
                      {dayEvents.map((calendarEvent) => (
                        <li key={calendarEvent.id} data-event-key={calendarEvent.id}>
                          <button type="button" className="calendar-view-event" onClick={() => openEvent(calendarEvent)}>
                            {searching
                              ? highlightSegments(eventTitle(calendarEvent), search).map((part, i) =>
                                  part.match ? (
                                    <Mark key={i} className="calendar-view-match">
                                      {part.text}
                                    </Mark>
                                  ) : (
                                    <React.Fragment key={i}>{part.text}</React.Fragment>
                                  ),
                                )
                              : eventTitle(calendarEvent)}
                          </button>
                          {resolvedFields.length > 0 && (
                            <span className="calendar-view-event-fields">
                              {resolvedFields.map((f) => {
                                const text = eventFieldText(f, calendarEvent);
                                const editable = isFieldEditable(f);
                                const nameId = `${baseId}-fn-${calendarEvent.id}-${f.id}`;
                                const valueId = `${baseId}-fv-${calendarEvent.id}-${f.id}`;
                                if (editing && editing.eventId === calendarEvent.id && editing.fieldId === f.id) {
                                  const kind = editorKind(f);
                                  return (
                                    <span key={f.id} className="calendar-view-event-field" data-field={f.id} data-editing="">
                                      <span className="calendar-view-event-field-name" id={nameId}>{f.header}</span>{" "}
                                      {kind === "select" || kind === "radio" ? (
                                        <select
                                          className="calendar-view-field-editor"
                                          aria-label={f.editLabel ?? f.header}
                                          aria-invalid={editing.invalid ? true : undefined}
                                          value={String(editing.draft ?? "")}
                                          onChange={(e) => {
                                            setEditing({ ...editing, draft: e.target.value, invalid: false });
                                            commitFieldEdit();
                                          }}
                                          onKeyDown={onFieldEditorKeyDown}
                                          onBlur={() => commitFieldEdit(false)}
                                        >
                                          <option value="" />
                                          {(f.options ?? []).map((option) => (
                                            <option key={option.id} value={option.id} disabled={option.disabled}>{option.label}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input
                                          className="calendar-view-field-editor"
                                          aria-label={f.editLabel ?? f.header}
                                          aria-invalid={editing.invalid ? true : undefined}
                                          type={kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text"}
                                          inputMode={kind === "number" ? "decimal" : undefined}
                                          value={String(editing.draft ?? "")}
                                          onChange={(e) => setEditing({ ...editing, draft: e.target.value, invalid: false })}
                                          onKeyDown={onFieldEditorKeyDown}
                                          onBlur={() => commitFieldEdit(false)}
                                        />
                                      )}
                                    </span>
                                  );
                                }
                                if (text === "" && !editable) return null;
                                return (
                                  <span key={f.id} className="calendar-view-event-field" data-field={f.id} data-type={f.type ?? "text"}>
                                    <span className="calendar-view-event-field-name" id={nameId}>{f.header}</span>{" "}
                                    {editable ? (
                                      <button type="button" className="calendar-view-field-button" id={valueId} aria-labelledby={`${nameId} ${valueId}`} onClick={() => startFieldEdit(calendarEvent, f)}>{text}</button>
                                    ) : (
                                      <span className="calendar-view-event-field-value">{text}</span>
                                    )}
                                  </span>
                                );
                              })}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
          {agendaDays.length === 0 && labels?.agendaEmpty && (
            <p className="calendar-view-agenda-empty">{labels.agendaEmpty}</p>
          )}
        </>
      ) : (
      <CalendarTable label={label} className="calendar-view-table" onKeyDown={onGridKeyDown}>
        <CalendarTableHead>
          <CalendarTableRow>
            {showWeekNumbers && (
              <CalendarTableTH scope="col" data-week-number-header="">
                {labels?.weekNumberHeader ?? ""}
              </CalendarTableTH>
            )}
            {Array.from({ length: view === "day" ? 1 : 7 }, (_, i) => {
              const weekday = view === "day" ? weekdayOf(anchorDate) : (firstDayOfWeek + i) % 7;
              return (
                <CalendarTableTH key={i} scope="col" data-weekend={weekendDays?.includes(weekday) ? "" : undefined}>
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
                const picked = selectionMode === "multiple" ? selectedDateSet.has(d) : selectedDate === d;
                const inRange = inSelectedRange(d);
                const dayRanges = rangesFor(d);
                return (
                  <CalendarTableTD
                    key={d}
                    selected={d === effectiveCursor}
                    today={isToday}
                    data-date={d}
                    data-outside-period={outside ? "" : undefined}
                    data-weekend={weekendDays?.includes(weekday) ? "" : undefined}
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
                    aria-describedby={rangeLabels(dayRanges) ? `${baseId}-rg-${d}` : undefined}
                    onClick={(e: React.MouseEvent) => onDayCellClick(d, e)}
                    onDragOver={(e: React.DragEvent) => {
                      if (draggingEventId.current && onEventMove) e.preventDefault();
                    }}
                    onDrop={(e: React.DragEvent) => onDayDrop(d, e)}
                  >
                    {rangeLabels(dayRanges) ? <span id={`${baseId}-rg-${d}`} hidden>{rangeLabels(dayRanges)}</span> : null}
                    {hideOutsideDays && outside
                      ? null
                      : day
                      ? day({
                          date: d,
                          events: dayEvents,
                          visibleEvents: maxEvents == null ? dayEvents : dayEvents.slice(0, Math.max(0, maxEvents)),
                          hiddenCount: maxEvents == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, maxEvents)),
                          isToday,
                          outsidePeriod: outside,
                          selected: picked,
                          disabled,
                          inRange,
                          ranges: dayRanges,
                          openEvent,
                          fieldText,
                          eventProps,
                        })
                      : (
                        <>
                          {parseIsoDate(d)?.day}
                          {dayRanges.map((range) => range.label && (
                            <span key={range.start + range.end + (range.kind ?? "") + range.label} className="calendar-view-range-label">{range.label}</span>
                          ))}
                        </>
                      )}
                  </CalendarTableTD>
                );
              })}
            </CalendarTableRow>
          ))}
        </CalendarTableBody>
      </CalendarTable>
      )}

      <div className="calendar-view-status" aria-live="polite">
        {statusMessage}
      </div>
    </div>
  );
}

export default CalendarView;
