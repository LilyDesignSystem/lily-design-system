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
  monthMatrix,
  parseIsoDate,
  weekdayOf,
} from "@lilydesignsystem/angular-date-time-picker";

export type CalendarViewMode = "week" | "four-week" | "month";

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
};

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
  view: CalendarViewMode,
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
      @if (labels().weekView || labels().fourWeekView || labels().monthView) {
        <div class="calendar-view-toolbar">
          <div class="calendar-view-switcher" role="group">
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
          </div>
          <div class="calendar-view-nav">
            <button
              type="button"
              class="calendar-view-previous-button"
              [attr.aria-label]="labels().previous?.(view()) ?? null"
              (click)="stepView(-1)"
            >‹</button>
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

      <lily-calendar-table
        [label]="label()"
        className="calendar-view-table"
        (keydown)="onGridKeydown($event)"
      >
        <thead lily-calendar-table-head>
          <tr lily-calendar-table-row>
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
                  [attr.data-selected]="selectedDate() === d ? '' : null"
                  [attr.data-disabled]="disabled ? '' : null"
                  [attr.aria-disabled]="disabled ? 'true' : null"
                  [attr.aria-label]="dayName(d, outside)"
                  (click)="onDayCellClick(d)"
                >
                  {{ dayNumber(d) }}
                  @for (event of eventsFor(d); track event.id) {
                    @if (eventTitle(event); as title) {
                      <button
                        type="button"
                        class="calendar-view-event"
                        (click)="openEvent(event); $event.stopPropagation()"
                      >{{ title }}</button>
                    }
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </lily-calendar-table>

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
  /** Events to place into day cells. */
  readonly events = input<CalendarEvent[]>([]);
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
  protected readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, i) => (this.firstDay() + i) % 7),
  );

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

  private pick(d: string): void {
    if (this.isDisabledDay(d)) return;
    this.selectedDate.set(d);
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
    if (this.view() === "week") this.navigateTo(addDays(anchor, delta * 7));
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
    if (this.view() === "week") this.moveCursor(addDays(cursor, delta * 7));
    else if (this.view() === "four-week") this.moveCursor(addDays(cursor, delta * 28));
    else this.moveCursor(addMonths(cursor, delta));
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    const cursor = this.effectiveCursor();
    const offset = (weekdayOf(cursor) - this.firstDay() + 7) % 7;
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
        this.moveCursor(addDays(cursor, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveCursor(addDays(cursor, 7));
        break;
      case "Home":
        event.preventDefault();
        this.moveCursor(addDays(cursor, -offset));
        break;
      case "End":
        event.preventDefault();
        this.moveCursor(addDays(cursor, 6 - offset));
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
        this.pick(cursor);
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
  }

  protected onDayCellClick(d: string): void {
    this.cursor.set(d);
    this.pick(d);
  }
}
