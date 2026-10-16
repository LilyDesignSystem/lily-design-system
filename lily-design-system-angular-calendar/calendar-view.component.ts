import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  afterNextRender,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import {
  CalendarTable,
  CalendarTableBody,
  CalendarTableHead,
  CalendarTableRow,
  CalendarTableTD,
  CalendarTableTH,
} from "@lilydesignsystem/angular-headless";
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
} from "@lilydesignsystem/angular-date-time-picker";

export type CalendarViewMode = "day" | "week" | "four-week" | "month" | "agenda";

/** A marked range (a holiday, a closure, a school term). */
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
  /** Switcher label for the one-day view. Gates its button. */
  dayView?: string;
  weekView?: string;
  fourWeekView?: string;
  monthView?: string;
  /** Switcher label for the agenda (list) view of the month. Gates its button. */
  agendaView?: string;
  /** Agenda view: the message when the shown month has no events (and `agendaEmptyDays` is off). Gates the message. */
  agendaEmpty?: string;
  previous?: (view: CalendarViewMode) => string;
  next?: (view: CalendarViewMode) => string;
  today?: string;
  periodAnnouncement?: (view: CalendarViewMode, start: string, end: string) => string;
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
  periodTitle?: (view: CalendarViewMode, start: string, end: string) => string;
  /** Text of the "+N more" button shown on a day that `maxEvents` caps: (hidden count, date). Gates the button. */
  moreEvents?: (hiddenCount: number, isoDate: string) => string;
};

/** Payload of the `eventMove` output. */
export type CalendarEventMoveEvent = { event: CalendarEvent; toDate: string };

/** Payload of the `rangeSelect` output. */
export type CalendarRangeSelectEvent = { start: string; end: string };

/** What a `day` template (`<ng-template lilyCalendarDay>`-style) would need; exposed through `dayContent`. */
export type DayArgs = {
  date: string;
  events: CalendarEvent[];
  isToday: boolean;
  outsidePeriod: boolean;
  selected: boolean;
  disabled: boolean;
};

/** Payload of the `navigate` output. */
export type CalendarNavigateEvent = { view: CalendarViewMode; start: string; end: string };

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate: string, firstDayOfWeek: number): string {
  const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
  return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(
  view: CalendarViewMode,
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
  view: CalendarViewMode,
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
  view: CalendarViewMode,
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

/**
 * CalendarView — a headless calendar: a week, a rolling four weeks, or a
 * padded month, with navigation, a view switcher, APG grid keyboard
 * navigation, a picked day, disabled days and consumer-rendered events.
 *
 * Composes `@lilydesignsystem/angular-headless`'s `CalendarTable` family
 * (unmodified) and `@lilydesignsystem/angular-date-time-picker`'s civil-date
 * arithmetic. Port of the canonical Svelte package; see `spec/index.md`.
 *
 * Each day cell shows its day-of-month number, followed by the titles of its
 * events (`event.title`, when it is a string) as buttons that emit
 * `eventClick` — Angular has no render-prop, so the Svelte `day` snippet's
 * job is done by that fixed, class-hooked markup (`.calendar-view-event`).
 */
@Component({
  selector: "lily-calendar-view",
  standalone: true,
  imports: [
    CalendarTable,
    CalendarTableBody,
    CalendarTableHead,
    CalendarTableRow,
    CalendarTableTD,
    CalendarTableTH,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #rootEl class="calendar-view {{ className() }}">
      @if (labels().periodTitle || labels().dayView || labels().weekView || labels().fourWeekView || labels().monthView || labels().agendaView) {
        <div class="calendar-view-toolbar">
          <div class="calendar-view-switcher" role="group">
            @if (labels().dayView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-day"
                [attr.aria-pressed]="view() === 'day'"
                (click)="setView('day')"
              >{{ labels().dayView }}</button>
            }
            @if (labels().weekView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-week"
                [attr.aria-pressed]="view() === 'week'"
                (click)="setView('week')"
              >{{ labels().weekView }}</button>
            }
            @if (labels().fourWeekView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-four-week"
                [attr.aria-pressed]="view() === 'four-week'"
                (click)="setView('four-week')"
              >{{ labels().fourWeekView }}</button>
            }
            @if (labels().monthView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-month"
                [attr.aria-pressed]="view() === 'month'"
                (click)="setView('month')"
              >{{ labels().monthView }}</button>
            }
            @if (labels().agendaView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-agenda"
                [attr.aria-pressed]="view() === 'agenda'"
                (click)="setView('agenda')"
              >{{ labels().agendaView }}</button>
            }
          </div>
          <div class="calendar-view-nav">
            <button
              type="button"
              class="calendar-view-previous-button"
              [attr.aria-label]="labels().previous?.(view()) ?? null"
              (click)="stepView(-1)"
            >‹</button>
            @if (labels().periodTitle; as periodTitle) {
              <span class="calendar-view-title">{{ periodTitle(view(), periodStart(), periodEnd()) }}</span>
            }
            @if (labels().today) {
              <button
                type="button"
                class="calendar-view-today-button"
                [disabled]="!today()"
                (click)="goToday()"
              >{{ labels().today }}</button>
            }
            <button
              type="button"
              class="calendar-view-next-button"
              [attr.aria-label]="labels().next?.(view()) ?? null"
              (click)="stepView(1)"
            >›</button>
          </div>
        </div>
      }

      @if (view() === "agenda") {
        <!-- The agenda is a plain list of days, not a grid: ordinary tab stops, no roving cursor. -->
        <ol class="calendar-view-agenda" [attr.aria-label]="label()">
          @for (d of agendaDays(); track d) {
            <li
              class="calendar-view-agenda-day"
              [attr.data-date]="d"
              [attr.data-today]="isToday(d) ? '' : null"
              [attr.data-weekend]="weekendDays()?.includes(weekdayOfDate(d)) ? '' : null"
              [attr.data-range]="rangeKinds(d)"
              [attr.aria-current]="isToday(d) ? 'date' : null"
            >
              <time class="calendar-view-agenda-date" [attr.datetime]="d">{{ dayName(d, false) || d }}</time>
              @if (eventsFor(d).length > 0) {
                <ul class="calendar-view-agenda-events">
                  @for (event of eventsFor(d); track event.id) {
                    <li>
                      <button type="button" class="calendar-view-event" (click)="openEvent(event)">{{ eventTitle(event) || event.id }}</button>
                    </li>
                  }
                </ul>
              }
            </li>
          }
        </ol>
        @if (agendaDays().length === 0 && labels().agendaEmpty; as agendaEmpty) {
          <p class="calendar-view-agenda-empty">{{ agendaEmpty }}</p>
        }
      } @else {
      <lily-calendar-table
        [label]="label()"
        className="calendar-view-table"
        (keydown)="onGridKeydown($event)"
      >
        <thead lily-calendar-table-head>
          <tr lily-calendar-table-row>
            @if (showWeekNumbers()) {
              <th lily-calendar-table-th scope="col" data-week-number-header>{{ labels().weekNumberHeader ?? "" }}</th>
            }
            @for (weekday of weekdays(); track $index) {
              <th lily-calendar-table-th scope="col">
                @if (labels().weekdayAbbr; as abbr) {
                  <abbr [attr.title]="labels().weekday?.(weekday) ?? abbr(weekday)">{{ abbr(weekday) }}</abbr>
                } @else if (labels().weekday; as full) {
                  {{ full(weekday) }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody lily-calendar-table-body>
          @for (week of days(); track $index) {
            <tr lily-calendar-table-row>
              @if (showWeekNumbers()) {
                @let weekNo = weekNumberOf(week);
                <th
                  lily-calendar-table-th
                  scope="row"
                  [attr.data-week-number]="weekNo"
                  [attr.aria-label]="labels().weekNumber?.(weekNo) ?? null"
                >{{ weekNo }}</th>
              }
              @for (d of week; track d) {
                @let outside = outsidePeriod(d);
                @let disabled = isDisabledDay(d);
                <td
                  lily-calendar-table-td
                  role="gridcell"
                  [attr.tabindex]="d === effectiveCursor() ? 0 : -1"
                  [attr.aria-selected]="d === effectiveCursor() ? 'true' : null"
                  [attr.aria-current]="isToday(d) ? 'date' : null"
                  [attr.data-date]="d"
                  [attr.data-outside-period]="outside ? '' : null"
                  [attr.data-weekend]="weekendDays()?.includes(weekdayOfDate(d)) ? '' : null"
                  [attr.data-selected]="isPicked(d) ? '' : null"
                  [attr.data-disabled]="disabled ? '' : null"
                  [attr.data-in-range]="inSelectedRange(d) ? '' : null"
                  [attr.data-range-start]="selectedRange()?.start === d ? '' : null"
                  [attr.data-range-end]="selectedRange()?.end === d ? '' : null"
                  [attr.data-range]="rangeKinds(d)"
                  [attr.aria-disabled]="disabled ? 'true' : null"
                  [attr.aria-label]="dayName(d, outside)"
                  (click)="onDayCellClick(d, $event)"
                  (dragover)="onDayDragOver($event)"
                  (drop)="onDayDrop(d, $event)"
                >
                  @if (!(hideOutsideDays() && outside)) {
                    {{ dayNumber(d) }}
                    @for (event of visibleEventsFor(d); track event.id) {
                      @if (eventTitle(event); as title) {
                        <button
                          type="button"
                          class="calendar-view-event"
                          [attr.draggable]="moveEvents() ? 'true' : null"
                          [attr.data-event-id]="moveEvents() ? event.id : null"
                          (dragstart)="onEventDragStart(event, $event)"
                          (click)="openEvent(event); $event.stopPropagation()"
                        >{{ title }}</button>
                      }
                    }
                    @if (hiddenCountFor(d) > 0 && labels().moreEvents; as more) {
                      <button
                        type="button"
                        class="calendar-view-more-button"
                        (click)="moreClick.emit(d); $event.stopPropagation()"
                      >{{ more(hiddenCountFor(d), d) }}</button>
                    }
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </lily-calendar-table>
      }

      <div class="calendar-view-status" aria-live="polite">{{ statusMessage() }}</div>
    </div>
  `,
})
export class CalendarView implements AfterViewInit {
  /** Accessible name for the calendar, passed through to CalendarTable. */
  readonly label = input.required<string>();
  /** Which period is shown. Two-way bindable: `[(view)]`. */
  readonly view = model<CalendarViewMode>("month");
  /** ISO date the visible period is computed around. Two-way bindable: `[(anchorDate)]`. */
  readonly anchorDate = model<string>("1970-01-01");
  /** ISO date the user has picked. Two-way bindable; distinct from the keyboard cursor. */
  readonly selectedDate = model<string | undefined>(undefined);
  /** Show an ISO week-number column (a row header per week). */
  readonly showWeekNumbers = input<boolean>(false);
  /** Marked ranges (holidays, closures): each day inside gets `data-range="{kind}"`. */
  readonly ranges = input<CalendarRange[]>([]);
  /** The picked range. Shift+arrows extend it from the cursor; Shift+click picks one; Escape clears it. Two-way bindable. */
  readonly selectedRange = model<SelectedRange | undefined>(undefined);
  /** Events to place into day cells. */
  readonly events = input<CalendarEvent[]>([]);
  /** Agenda view: also list days with no events. Default false (only days with events). */
  readonly agendaEmptyDays = input<boolean>(false);
  /** Cap on events shown per day; a day with more shows a "+N more" button (`labels.moreEvents`) that fires `moreClick`. */
  readonly maxEvents = input<number | undefined>(undefined);
  /** Turns on event drag-and-drop between days and Alt+arrow keys on a focused event button; `eventMove` fires when one moves. */
  readonly moveEvents = input<boolean>(false);
  /** Month view: leave days outside the shown month empty (the cell keeps `data-outside-period`). */
  readonly hideOutsideDays = input<boolean>(false);
  /** Weekday numbers (0 = Sunday … 6 = Saturday) that are the weekend; those cells get `data-weekend`. */
  readonly weekendDays = input<number[] | undefined>(undefined);
  /** `"multiple"`: Enter/Space or a click toggles a day in `selectedDates` instead of setting `selectedDate`. */
  readonly selectionMode = input<"single" | "multiple">("single");
  /** The picked days in `"multiple"` mode. Two-way bindable. */
  readonly selectedDates = model<string[]>([]);
  /** ISO date marking "today"; never computed internally (stays SSR-safe). */
  readonly today = input<string>("");
  /** Earliest pickable ISO date. */
  readonly minDate = input<string>("");
  /** Latest pickable ISO date. */
  readonly maxDate = input<string>("");
  /** Extra disabled-day test. Disabled days stay focusable but cannot be picked. */
  readonly isDisabled = input<((isoDate: string) => boolean) | undefined>(undefined);
  /** BCP 47 locale, passed to firstDayOfWeekFor. */
  readonly locale = input<string | undefined>(undefined);
  readonly labels = input<CalendarViewLabels>({});
  /** Extra CSS class on the root. */
  readonly className = input<string>("");

  /** Fires whenever the visible period changes. */
  readonly navigate = output<CalendarNavigateEvent>();
  /** Fires when an enabled day cell is activated (Enter/Space, or click). */
  readonly dayClick = output<string>();
  /** Fires when an event button is activated. */
  readonly eventClick = output<CalendarEvent>();
  /** Fires when a range is confirmed: Enter on an extended range, or Shift+click. */
  readonly rangeSelect = output<CalendarRangeSelectEvent>();
  /** Fires when an event is moved to another day (drag-and-drop or Alt+arrow keys). Needs `[moveEvents]="true"`. */
  readonly eventMove = output<CalendarEventMoveEvent>();
  /** Fires with the date when a day's "+N more" button is pressed. */
  readonly moreClick = output<string>();

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  protected readonly statusMessage = signal("");
  private readonly cursor = signal<string | null>(null);

  protected readonly firstDay = computed(() => firstDayOfWeekFor(this.locale()));
  protected readonly days = computed(() =>
    periodDays(this.view(), this.anchorDate(), this.firstDay()),
  );
  private readonly flatDays = computed(() => this.days().flat());
  private readonly eventMap = computed(() => eventsByDay(this.events()));
  // Agenda: the days of the shown month that have events (all of them with `agendaEmptyDays`).
  protected readonly agendaDays = computed(() => {
    if (this.view() !== "agenda") return [] as string[];
    const [start, end] = periodRange("agenda", this.anchorDate(), this.firstDay());
    const out: string[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      if (this.agendaEmptyDays() || (this.eventsFor(d).length > 0)) out.push(d);
    }
    return out;
  });
  protected readonly weekdays = computed(() =>
    this.view() === "day"
      ? [weekdayOf(this.anchorDate())]
      : Array.from({ length: 7 }, (_, i) => (this.firstDay() + i) % 7),
  );
  protected readonly periodStart = computed(() => periodRange(this.view(), this.anchorDate(), this.firstDay())[0]);
  protected readonly periodEnd = computed(() => periodRange(this.view(), this.anchorDate(), this.firstDay())[1]);

  /** The roving cursor, kept inside the visible days when the period changes from outside. */
  protected readonly effectiveCursor = computed(() => {
    const visible = this.flatDays();
    const cursor = this.cursor() ?? this.anchorDate();
    if (visible.includes(cursor)) return cursor;
    return visible.includes(this.anchorDate()) ? this.anchorDate() : visible[0];
  });

  /**
   * Angular's headless `CalendarTable` does not set `role="grid"` on its
   * rendered `<table>` (the same gap `kanban-board` and `gantt-chart` patch),
   * so the WAI-ARIA APG Grid role is applied here, once, after the view renders.
   */
  ngAfterViewInit(): void {
    this.rootRef()
      .nativeElement.querySelector("table.calendar-table")
      ?.setAttribute("role", "grid");
  }

  protected dayNumber(d: string): number | undefined {
    return parseIsoDate(d)?.day;
  }

  protected eventsFor(d: string): CalendarEvent[] {
    return this.eventMap().get(d) ?? [];
  }

  protected visibleEventsFor(d: string): CalendarEvent[] {
    const all = this.eventsFor(d);
    const max = this.maxEvents();
    return max == null ? all : all.slice(0, Math.max(0, max));
  }

  protected hiddenCountFor(d: string): number {
    const max = this.maxEvents();
    return max == null ? 0 : Math.max(0, this.eventsFor(d).length - Math.max(0, max));
  }

  protected weekdayOfDate(d: string): number {
    return weekdayOf(d);
  }

  protected isPicked(d: string): boolean {
    return this.selectionMode() === "multiple" ? this.selectedDates().includes(d) : this.selectedDate() === d;
  }

  // ---------------------------------------------------------------
  // Event drag-and-drop (supplementary pointer path) + Alt+arrow keys
  // ---------------------------------------------------------------

  private draggingEventId: string | null = null;

  protected onEventDragStart(calendarEvent: CalendarEvent, event: DragEvent): void {
    if (!this.moveEvents()) return;
    this.draggingEventId = calendarEvent.id;
    event.dataTransfer?.setData("text/plain", calendarEvent.id);
  }

  private moveEventTo(calendarEvent: CalendarEvent, toDate: string): void {
    if (!this.moveEvents() || this.isDisabledDay(toDate)) return;
    this.eventMove.emit({ event: calendarEvent, toDate });
    const message = this.labels().eventMoveAnnouncement?.(calendarEvent, toDate);
    if (message) this.statusMessage.set(message);
  }

  protected onDayDragOver(event: DragEvent): void {
    if (this.draggingEventId && this.moveEvents()) event.preventDefault();
  }

  protected onDayDrop(isoDate: string, event: DragEvent): void {
    event.preventDefault();
    const id = this.draggingEventId ?? event.dataTransfer?.getData("text/plain");
    this.draggingEventId = null;
    const calendarEvent = this.events().find((e) => e.id === id);
    if (calendarEvent) this.moveEventTo(calendarEvent, isoDate);
  }

  protected eventTitle(event: CalendarEvent): string {
    return typeof event["title"] === "string" ? (event["title"] as string) : "";
  }

  protected outsidePeriod(d: string): boolean {
    return isOutsidePeriod(this.view(), d, this.anchorDate());
  }

  protected isToday(d: string): boolean {
    const today = this.today();
    return !!today && d === today;
  }

  protected dayName(d: string, outside: boolean): string | null {
    return this.labels().day?.(d, weekdayOf(d), outside) ?? null;
  }

  protected isDisabledDay(d: string): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if (min && d < min) return true;
    if (max && d > max) return true;
    return this.isDisabled()?.(d) ?? false;
  }

  // ---------------------------------------------------------------
  // Range selection: Shift+arrows extend from an anchor; Enter confirms.
  // ---------------------------------------------------------------

  private rangeAnchor: string | null = null;
  private static readonly MOVE_KEYS = new Set([
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown",
  ]);

  private setRange(a: string, b: string): void {
    const [start, end] = a <= b ? [a, b] : [b, a];
    this.selectedRange.set({ start, end });
    const message = this.labels().rangeAnnouncement?.(start, end);
    if (message) this.statusMessage.set(message);
  }

  private confirmRange(): void {
    const range = this.selectedRange();
    if (!range) return;
    this.rangeAnchor = null;
    this.rangeSelect.emit({ start: range.start, end: range.end });
  }

  protected inSelectedRange(d: string): boolean {
    const r = this.selectedRange();
    return !!r && d >= r.start && d <= r.end;
  }

  protected rangeKinds(d: string): string | null {
    const kinds = this.ranges()
      .filter((r) => d >= r.start && d <= r.end)
      .map((r) => r.kind ?? "range");
    return kinds.length ? kinds.join(" ") : null;
  }

  /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
  protected weekNumberOf(row: string[]): number {
    return isoWeek(row.find((d) => weekdayOf(d) === 4) ?? row[0]);
  }

  private pick(d: string): void {
    if (this.isDisabledDay(d)) return;
    if (this.selectionMode() === "multiple") {
      const current = this.selectedDates();
      this.selectedDates.set(current.includes(d) ? current.filter((x) => x !== d) : [...current, d].sort());
    } else {
      this.selectedDate.set(d);
    }
    this.dayClick.emit(d);
  }

  protected openEvent(event: CalendarEvent): void {
    this.eventClick.emit(event);
  }

  private announce(): void {
    const l = this.labels();
    if (!l.periodAnnouncement) return;
    const [start, end] = periodRange(this.view(), this.anchorDate(), this.firstDay());
    this.statusMessage.set(l.periodAnnouncement(this.view(), start, end));
  }

  private navigateTo(nextAnchor: string): void {
    this.anchorDate.set(nextAnchor);
    const [start, end] = periodRange(this.view(), nextAnchor, this.firstDay());
    this.navigate.emit({ view: this.view(), start, end });
    this.announce();
  }

  protected stepView(delta: 1 | -1): void {
    const anchor = this.anchorDate();
    if (this.view() === "day") this.navigateTo(addDays(anchor, delta));
    else if (this.view() === "week") this.navigateTo(addDays(anchor, delta * 7));
    else if (this.view() === "four-week") this.navigateTo(addDays(anchor, delta * 28));
    else this.navigateTo(addMonths(anchor, delta));
  }

  protected goToday(): void {
    const today = this.today();
    if (!today) return;
    this.navigateTo(today);
  }

  protected setView(next: CalendarViewMode): void {
    this.view.set(next);
    const [start, end] = periodRange(next, this.anchorDate(), this.firstDay());
    this.navigate.emit({ view: next, start, end });
    this.announce();
  }

  private focusCursor(): void {
    this.cdr.detectChanges();
    afterNextRender(
      () =>
        this.rootRef()
          .nativeElement.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')
          ?.focus({ preventScroll: true }),
      { injector: this.injector },
    );
  }

  /** Move the cursor, re-paging the visible period when it leaves it. */
  private moveCursor(next: string): void {
    this.cursor.set(next);
    const view = this.view();
    const anchorDate = this.anchorDate();
    if (view === "month") {
      const cp = parseIsoDate(next);
      const anchor = parseIsoDate(anchorDate);
      if (cp && anchor && (cp.year !== anchor.year || cp.month !== anchor.month)) {
        this.navigateTo(formatIsoDate({ year: cp.year, month: cp.month, day: 1 }));
      }
    } else if (view === "day") {
      if (next !== anchorDate) this.navigateTo(next);
    } else {
      const len = view === "week" ? 7 : 28;
      let start = weekStart(anchorDate, this.firstDay());
      if (next < start) {
        while (next < start) start = addDays(start, -7);
        this.navigateTo(start);
      } else {
        let end = addDays(start, len - 1);
        if (next > end) {
          while (next > end) {
            start = addDays(start, 7);
            end = addDays(start, len - 1);
          }
          this.navigateTo(start);
        }
      }
    }
    this.focusCursor();
  }

  private pageCursor(delta: 1 | -1): void {
    const cursor = this.effectiveCursor();
    if (this.view() === "day") this.moveCursor(addDays(cursor, delta));
    else if (this.view() === "week") this.moveCursor(addDays(cursor, delta * 7));
    else if (this.view() === "four-week") this.moveCursor(addDays(cursor, delta * 28));
    else this.moveCursor(addMonths(cursor, delta));
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    if (this.moveEvents() && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
      const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset["date"];
      const calendarEvent = this.events().find((e) => e.id === el?.dataset["eventId"]);
      if (el && fromDate && calendarEvent) {
        event.preventDefault();
        const week = this.view() === "day" ? 1 : 7;
        const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[event.key as string]!;
        this.moveEventTo(calendarEvent, addDays(fromDate, delta));
        return;
      }
    }
    const cursor = this.effectiveCursor();
    const offset = this.view() === "day" ? 0 : (weekdayOf(cursor) - this.firstDay() + 7) % 7;
    const extending = event.shiftKey && CalendarView.MOVE_KEYS.has(event.key);
    if (extending && this.rangeAnchor === null) {
      this.rangeAnchor = this.selectedDate() && !this.selectedRange() ? this.selectedDate()! : cursor;
    }
    if (!extending && CalendarView.MOVE_KEYS.has(event.key)) this.rangeAnchor = null;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        this.moveCursor(addDays(cursor, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveCursor(addDays(cursor, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        this.moveCursor(addDays(cursor, this.view() === "day" ? -1 : -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveCursor(addDays(cursor, this.view() === "day" ? 1 : 7));
        break;
      case "Home":
        event.preventDefault();
        this.moveCursor(addDays(cursor, -offset));
        break;
      case "End":
        event.preventDefault();
        this.moveCursor(addDays(cursor, this.view() === "day" ? 0 : 6 - offset));
        break;
      case "PageUp":
        event.preventDefault();
        this.pageCursor(-1);
        break;
      case "PageDown":
        event.preventDefault();
        this.pageCursor(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (this.rangeAnchor !== null && this.selectedRange()) this.confirmRange();
        else this.pick(cursor);
        break;
      case "Escape":
        if (this.selectedRange() || this.rangeAnchor !== null) {
          event.preventDefault();
          this.rangeAnchor = null;
          this.selectedRange.set(undefined);
        }
        break;
      case "t":
      case "T": {
        const today = this.today();
        if (!today || event.ctrlKey || event.metaKey || event.altKey) break;
        event.preventDefault();
        this.navigateTo(today);
        this.moveCursor(today);
        break;
      }
    }
    if (extending && this.rangeAnchor !== null) this.setRange(this.rangeAnchor, this.effectiveCursor());
  }

  protected onDayCellClick(d: string, event: MouseEvent): void {
    if (event.shiftKey && !this.isDisabledDay(d)) {
      // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
      const from = this.selectedDate() && !this.selectedRange() ? this.selectedDate()! : this.effectiveCursor();
      this.setRange(from, d);
      this.cursor.set(d);
      this.confirmRange();
      return;
    }
    this.cursor.set(d);
    this.rangeAnchor = null;
    this.pick(d);
  }
}
