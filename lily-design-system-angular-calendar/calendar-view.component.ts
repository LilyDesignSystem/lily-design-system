import { NgTemplateOutlet } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  afterNextRender,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  DestroyRef,
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
  Mark,
  SearchInput,
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
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data";
import { civilDateToDate } from "./cell-types";
import { highlightSegments, matchesSearch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import {
  draftOf,
  editorKind,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText as fieldTextOf,
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

/** What `exportHandler` and the `exportFile` output receive. Return `false` from `exportHandler` to take over the download. */
export type CalendarExport = { format: ExportFormat; filename: string; eventCount: number; blob: Blob };

/** What the `fieldEdit` output carries. */
export type CalendarFieldEdit = { eventId: string; fieldId: string; value: unknown; previous: unknown };

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
  periodTitle?: (view: CalendarViewMode, start: string, end: string, anchorDate: string) => string;
  /** Text of the "+N more" button shown on a day that `maxEvents` caps: (hidden count, date). Gates the button. */
  moreEvents?: (hiddenCount: number, isoDate: string) => string;
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
  /** Announced when navigation stops at `minDate` or `maxDate`: (which limit, that date). Without it a stopped Previous / Next / Page key is silent. */
  rangeLimit?: (limit: "min" | "max", date: string) => string;
  /** Accessible name of the search field. Gates the field. */
  search?: string;
  /** Announced after the search changes: (matching events, all events). */
  searchAnnouncement?: (matchCount: number, totalCount: number) => string;
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

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
function nextCalendarViewId(): string {
  uid += 1;
  return `calendar-view-${uid}`;
}

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
    Mark,
    SearchInput,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #rootEl class="calendar-view {{ className() }}" (keydown)="onRootKeydown($event)">
      @if (labels().periodTitle || labels().dayView || labels().weekView || labels().fourWeekView || labels().monthView || labels().agendaView) {
        <div class="calendar-view-toolbar">
          <div class="calendar-view-switcher" role="group">
            @if (labels().dayView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-day"
                [attr.aria-pressed]="shownView() === 'day'"
                (click)="setView('day')"
              >{{ labels().dayView }}</button>
            }
            @if (labels().weekView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-week"
                [attr.aria-pressed]="shownView() === 'week'"
                (click)="setView('week')"
              >{{ labels().weekView }}</button>
            }
            @if (labels().fourWeekView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-four-week"
                [attr.aria-pressed]="shownView() === 'four-week'"
                (click)="setView('four-week')"
              >{{ labels().fourWeekView }}</button>
            }
            @if (labels().monthView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-month"
                [attr.aria-pressed]="shownView() === 'month'"
                (click)="setView('month')"
              >{{ labels().monthView }}</button>
            }
            @if (labels().agendaView) {
              <button
                type="button"
                class="calendar-view-switcher-button calendar-view-switcher-button-agenda"
                [attr.aria-pressed]="shownView() === 'agenda'"
                (click)="setView('agenda')"
              >{{ labels().agendaView }}</button>
            }
          </div>
          <div class="calendar-view-nav">
            <button
              type="button"
              class="calendar-view-previous-button"
              [attr.aria-label]="labels().previous?.(shownView()) ?? null"
              [attr.aria-disabled]="atMinLimit() ? 'true' : null"
              (click)="stepView(-1)"
            >‹</button>
            @if (labels().periodTitle; as periodTitle) {
              <span class="calendar-view-title">{{ periodTitle(shownView(), periodStart(), periodEnd(), anchorDate()) }}</span>
            }
            @if (labels().today) {
              <button
                type="button"
                class="calendar-view-today-button"
                [disabled]="!today()"
                [attr.aria-disabled]="today() && todayOutOfRange() ? 'true' : null"
                (click)="goToday()"
              >{{ labels().today }}</button>
            }
            <button
              type="button"
              class="calendar-view-next-button"
              [attr.aria-label]="labels().next?.(shownView()) ?? null"
              [attr.aria-disabled]="atMaxLimit() ? 'true' : null"
              (click)="stepView(1)"
            >›</button>
          </div>
        </div>
      }

      @if (labels().search; as searchLabel) {
        <lily-search-input className="calendar-view-search" [label]="searchLabel" [value]="search()" (valueChange)="search.set($event)" (keydown)="onSearchKeydown($event)" />
      }

      @if (hasExportButtons()) {
        <div class="calendar-view-export" role="group" [attr.aria-label]="labels().export ?? null">
          @if (labels().copy; as copy) {
            <button type="button" class="calendar-view-export-button" data-calendar-export-format="copy" [disabled]="exportEvents().length === 0" (click)="runExport('copy')">{{ copy }}</button>
          }
          @if (labels().exportCsv; as csv) {
            <button type="button" class="calendar-view-export-button" data-calendar-export-format="csv" [disabled]="exportEvents().length === 0" (click)="runExport('csv')">{{ csv }}</button>
          }
          @if (labels().exportTsv; as tsv) {
            <button type="button" class="calendar-view-export-button" data-calendar-export-format="tsv" [disabled]="exportEvents().length === 0" (click)="runExport('tsv')">{{ tsv }}</button>
          }
          @if (labels().exportExcel; as excel) {
            <button type="button" class="calendar-view-export-button" data-calendar-export-format="xlsx" [disabled]="exportEvents().length === 0" (click)="runExport('xlsx')">{{ excel }}</button>
          }
        </div>
      }

      @if (shownView() === "agenda") {
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
              <time
                class="calendar-view-agenda-date"
                [attr.datetime]="d"
                [attr.data-visually-hidden]="agendaDate() ? null : ''"
                [attr.style]="agendaDate() ? null : 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap'"
              >{{ dayName(d, false) || d }}</time>
              @for (range of rangesOf(d); track range.start + range.end + (range.kind ?? "") + (range.label ?? "")) {
                @if (range.label) {
                  <span class="calendar-view-range-label">{{ range.label }}</span>
                }
              }
              @if (eventsFor(d).length > 0) {
                <ul class="calendar-view-agenda-events">
                  @for (event of eventsFor(d); track event.id) {
                    <li [attr.data-event-key]="event.id">
                      <button type="button" class="calendar-view-event" (click)="openEvent(event)">@if (searching()) {@for (part of titleSegments(event); track $index) {@if (part.match) {<lily-mark className="calendar-view-match">{{ part.text }}</lily-mark>} @else {{{ part.text }}}}} @else {{{ eventTitle(event) || event.id }}}</button>
                      @if (resolvedFields().length > 0) {
                        <span class="calendar-view-event-fields">
                          @for (f of resolvedFields(); track f.id) {
                            @let text = eventFieldText(f, event);
                            @let editable = isFieldEditable(f);
                            @if (editing(); as ed) {
                              @if (ed.eventId === event.id && ed.fieldId === f.id) {
                                <span class="calendar-view-event-field" [attr.data-field]="f.id" data-editing="">
                                  <span class="calendar-view-event-field-name" [id]="fieldNameId(event.id, f.id)">{{ f.header }}</span>{{ " " }}
                                  @if (kindOf(f) === "select" || kindOf(f) === "radio") {
                                    <select
                                      class="calendar-view-field-editor"
                                      [attr.aria-label]="f.editLabel ?? f.header"
                                      [attr.aria-invalid]="ed.invalid ? 'true' : null"
                                      [value]="editorValue(ed.draft)"
                                      (change)="onEditorSelectChange($event)"
                                      (keydown)="onEditorKeydown($event)"
                                      (blur)="commitFieldEdit(false)"
                                    >
                                      <option value=""></option>
                                      @for (option of f.options ?? []; track option.id) {
                                        <option [value]="option.id" [disabled]="option.disabled ?? false" [selected]="option.id === editorValue(ed.draft)">{{ option.label }}</option>
                                      }
                                    </select>
                                  } @else {
                                    <input
                                      class="calendar-view-field-editor"
                                      [attr.aria-label]="f.editLabel ?? f.header"
                                      [attr.aria-invalid]="ed.invalid ? 'true' : null"
                                      [type]="kindOf(f) === 'number' ? 'number' : kindOf(f) === 'date' ? 'date' : kindOf(f) === 'time' ? 'time' : 'text'"
                                      [attr.inputmode]="kindOf(f) === 'number' ? 'decimal' : null"
                                      [value]="editorValue(ed.draft)"
                                      (input)="onEditorInput($event)"
                                      (keydown)="onEditorKeydown($event)"
                                      (blur)="commitFieldEdit(false)"
                                    />
                                  }
                                </span>
                              } @else if (text !== "" || editable) {
                                <ng-container *ngTemplateOutlet="fieldView; context: { f: f, event: event, text: text, editable: editable }" />
                              }
                            } @else if (text !== "" || editable) {
                              <ng-container *ngTemplateOutlet="fieldView; context: { f: f, event: event, text: text, editable: editable }" />
                            }
                          }
                        </span>
                      }
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
              <th lily-calendar-table-th scope="col" [attr.data-weekend]="weekendDays()?.includes(weekday) ? '' : null">
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
                  [attr.aria-describedby]="rangeLabelsOf(d) ? baseId + '-rg-' + d : null"
                  (click)="onDayCellClick(d, $event)"
                  (dragover)="onDayDragOver($event)"
                  (drop)="onDayDrop(d, $event)"
                >
                  @if (rangeLabelsOf(d); as rangeText) {
                    <span [id]="baseId + '-rg-' + d" hidden>{{ rangeText }}</span>
                  }
                  @if (!(hideOutsideDays() && outside)) {
                    {{ dayNumber(d) }}
                    @for (range of rangesOf(d); track range.start + range.end + (range.kind ?? "") + (range.label ?? "")) {
                      @if (range.label) {
                        <span class="calendar-view-range-label">{{ range.label }}</span>
                      }
                    }
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
    <ng-template #fieldView let-f="f" let-event="event" let-text="text" let-editable="editable">
      <span class="calendar-view-event-field" [attr.data-field]="f.id" [attr.data-type]="f.type ?? 'text'">
        <span class="calendar-view-event-field-name" [id]="fieldNameId(event.id, f.id)">{{ f.header }}</span>{{ " " }}
        @if (editable) {
          <button
            type="button"
            class="calendar-view-field-button"
            [id]="fieldValueId(event.id, f.id)"
            [attr.aria-labelledby]="fieldNameId(event.id, f.id) + ' ' + fieldValueId(event.id, f.id)"
            (click)="startFieldEdit(event, f)"
          >{{ text }}</button>
        } @else {
          <span class="calendar-view-event-field-value">{{ text }}</span>
        }
      </span>
    </ng-template>
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
  /** Search: shows only the events whose text contains every word of it (any order, ignoring case and diacritics), in every view; the agenda wraps matches in `<mark class="calendar-view-match">`. Exports hold what the search leaves. Escape in the field clears it. Two-way bindable: `[(search)]`. */
  readonly search = model<string>("");
  /** Hides events for which it returns false (a category, owner or status filter). Combines with `search`; both must pass. */
  readonly filter = input<((event: CalendarEvent) => boolean) | undefined>(undefined);
  /** Orders the events within a day (and so in the agenda). Stable. Without it events keep the order of `events`. */
  readonly eventCompare = input<((a: CalendarEvent, b: CalendarEvent) => number) | undefined>(undefined);
  /** The text `search` looks in. Defaults to the event's title and every field's text. */
  readonly searchText = input<((event: CalendarEvent) => string) | undefined>(undefined);
  /** Show the agenda on a narrow screen: a viewport narrower than this many pixels (for example `640`) reads as the agenda view, and goes back to `view` when it is wider. A view the user picks with the switcher is respected. Needs `matchMedia`; without it nothing changes. */
  readonly agendaBelow = input<number | undefined>(undefined);
  /** Agenda view: show the date beside each day's events (default `true`). `false` hides it visually, keeping it for screen readers (a `<time>` with a `datetime`), for a layout that shows its own date. */
  readonly agendaDate = input<boolean>(true);
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
  /** Typed event fields, read from `event.values`. The agenda shows them after each event's title; `fieldText(event, fieldId)` is a public method for anything else. Editable types edit in the agenda (click the value; Tab moves to the next) when `editableFields` is on. */
  readonly eventFields = input<CalendarEventField[] | undefined>(undefined);
  /** Turns field editing on. It stands in for "a `fieldEdit` listener is attached", which an Angular output cannot report. */
  readonly editableFields = input<boolean>(false);
  /** The file name without its extension. Default `"calendar"`. */
  readonly exportFilename = input<string>("calendar");
  /** What an export holds: `"period"` (default) is the events that touch the shown period; `"all"` is every event. */
  readonly exportScope = input<"period" | "all">("period");
  /** Called before the download with the finished file. Return `false` to skip the built-in download. */
  readonly exportHandler = input<((file: CalendarExport) => boolean | void) | undefined>(undefined);
  /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` output fires first. */
  readonly copyHandler = input<((copy: { text: string; rowCount: number }) => boolean | void) | undefined>(undefined);
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
  /** Fires with each accepted field edit. The consumer updates `events`. */
  readonly fieldEdit = output<CalendarFieldEdit>();
  /** Fires with an export file, before it is saved. */
  readonly exportFile = output<CalendarExport>();
  readonly copy = output<{ text: string; rowCount: number }>();

  protected readonly baseId = nextCalendarViewId();

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  protected readonly statusMessage = signal("");
  private readonly cursor = signal<string | null>(null);

  // A narrow screen shows the agenda: with `agendaBelow` set, a viewport narrower than that many pixels reads as the agenda view
  // (the `view` model is untouched, so a wide screen goes back to it). A view the user picks on purpose is respected.
  private readonly narrow = signal(false);
  private readonly pickedOnPurpose = signal(false);
  protected readonly shownView = computed<CalendarViewMode>(() => (this.narrow() && !this.pickedOnPurpose() ? "agenda" : this.view()));
  private narrowQuery: MediaQueryList | null = null;
  private readonly updateNarrow = () => {
    this.narrow.set(!!this.narrowQuery?.matches);
    if (!this.narrowQuery?.matches) this.pickedOnPurpose.set(false);
  };
  private readonly narrowEffect = effect(() => {
    const below = this.agendaBelow();
    this.narrowQuery?.removeEventListener?.("change", this.updateNarrow);
    this.narrowQuery = null;
    if (below === undefined || typeof matchMedia !== "function") {
      this.narrow.set(false);
      return;
    }
    this.narrowQuery = matchMedia(`(max-width: ${below - 1}px)`);
    this.updateNarrow();
    this.narrowQuery.addEventListener?.("change", this.updateNarrow);
  });
  private readonly narrowCleanup = inject(DestroyRef).onDestroy(() => this.narrowQuery?.removeEventListener?.("change", this.updateNarrow));

  protected readonly firstDay = computed(() => firstDayOfWeekFor(this.locale()));
  protected readonly days = computed(() =>
    periodDays(this.shownView(), this.anchorDate(), this.firstDay()),
  );
  private readonly flatDays = computed(() => this.days().flat());
  protected readonly searching = computed(() => this.search().trim() !== "");
  /** The events the search leaves (all of them without one), found once per query / event change. */
  protected readonly shownEvents = computed(() => {
    const filter = this.filter();
    const searching = this.searching();
    const query = this.search();
    const text = this.searchText() ?? ((e: CalendarEvent) => [this.titleOf(e), ...this.resolvedFields().map((f) => fieldTextOf(f, e.values))].join(" "));
    const narrowed = searching || filter ? this.events().filter((e) => (!filter || filter(e)) && (!searching || matchesSearch(text(e), query))) : this.events();
    const compare = this.eventCompare();
    return compare ? [...narrowed].sort(compare) : narrowed;
  });
  private readonly eventMap = computed(() => eventsByDay(this.shownEvents()));
  private readonly eventById = computed(() => new Map(this.events().map((e) => [e.id, e])));
  private readonly selectedDateSet = computed(() => new Set(this.selectedDates()));
  // The marked ranges per visible day, found once per `ranges` / period change rather than once per cell per render.
  private readonly rangesByDay = computed(() => {
    const map = new Map<string, CalendarRange[]>();
    const ranges = this.ranges();
    if (ranges.length === 0) return map;
    for (const d of this.shownView() === "agenda" ? this.agendaDays() : this.flatDays()) {
      const hit = ranges.filter((r) => d >= r.start && d <= r.end);
      if (hit.length > 0) map.set(d, hit);
    }
    return map;
  });
  // Agenda: the days of the shown month that have events (all of them with `agendaEmptyDays`).
  protected readonly agendaDays = computed(() => {
    if (this.shownView() !== "agenda") return [] as string[];
    const [start, end] = periodRange("agenda", this.anchorDate(), this.firstDay());
    const out: string[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      if (this.agendaEmptyDays() || (this.eventsFor(d).length > 0)) out.push(d);
    }
    return out;
  });
  protected readonly weekdays = computed(() =>
    this.shownView() === "day"
      ? [weekdayOf(this.anchorDate())]
      : Array.from({ length: 7 }, (_, i) => (this.firstDay() + i) % 7),
  );
  protected readonly periodStart = computed(() => periodRange(this.shownView(), this.anchorDate(), this.firstDay())[0]);
  protected readonly periodEnd = computed(() => periodRange(this.shownView(), this.anchorDate(), this.firstDay())[1]);

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
    return this.selectionMode() === "multiple" ? this.selectedDateSet().has(d) : this.selectedDate() === d;
  }

  // ---------------------------------------------------------------
  // Typed fields, inline editing (agenda), export
  // ---------------------------------------------------------------

  // Type defaults (format, compare, export value) resolved once per `eventFields` / `locale` change, never per event or keystroke.
  protected readonly resolvedFields = computed(() => resolveFields(this.eventFields(), this.locale()));
  protected isFieldEditable(f: CalendarEventField): boolean {
    return this.editableFields() && isEditableField(f);
  }
  protected eventFieldText(f: ResolvedField, calendarEvent: CalendarEvent): string {
    return fieldTextOf(f, calendarEvent.values);
  }
  /** The formatted text of one event's typed field (empty when the event has no value for it). */
  fieldText(calendarEvent: CalendarEvent, fieldId: string): string {
    const f = this.resolvedFields().find((x) => x.id === fieldId);
    return f ? this.eventFieldText(f, calendarEvent) : "";
  }
  protected kindOf(f: CalendarEventField): ReturnType<typeof editorKind> {
    return editorKind(f);
  }
  protected editorValue(draft: Draft): string {
    return String(draft ?? "");
  }
  protected fieldNameId(eventId: string, fieldId: string): string {
    return `${this.baseId}-fn-${eventId}-${fieldId}`;
  }
  protected fieldValueId(eventId: string, fieldId: string): string {
    return `${this.baseId}-fv-${eventId}-${fieldId}`;
  }
  private titleOf(calendarEvent: CalendarEvent): string {
    return this.eventTitle(calendarEvent) || calendarEvent.id;
  }

  /** The field being edited, if any: the draft is the editor's text. */
  protected readonly editing = signal<{ eventId: string; fieldId: string; draft: Draft; invalid?: boolean } | null>(null);
  /** Accepted field edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through `fieldEdit` like any edit. */
  private history: EditHistory = EMPTY_HISTORY;

  protected startFieldEdit(calendarEvent: CalendarEvent, f: ResolvedField): void {
    if (!this.isFieldEditable(f)) return;
    this.editing.set({ eventId: calendarEvent.id, fieldId: f.id, draft: draftOf(f, calendarEvent.values) });
    this.cdr.detectChanges();
    afterNextRender(
      () => {
        const editor = this.rootRef().nativeElement.querySelector<HTMLInputElement>(".calendar-view-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
      },
      { injector: this.injector },
    );
  }

  private focusFieldButton(eventId: string, fieldId: string): void {
    this.cdr.detectChanges();
    afterNextRender(
      () => {
        const li = Array.from(this.rootRef().nativeElement.querySelectorAll<HTMLElement>("[data-event-key]")).find((el) => el.dataset["eventKey"] === eventId);
        const field = Array.from(li?.querySelectorAll<HTMLElement>("[data-field]") ?? []).find((el) => el.dataset["field"] === fieldId);
        field?.querySelector<HTMLElement>(".calendar-view-field-button")?.focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  protected commitFieldEdit(refocus = true): boolean {
    const current = this.editing();
    if (!current) return true;
    const { eventId, fieldId, draft } = current;
    const calendarEvent = this.eventById().get(eventId);
    const f = this.resolvedFields().find((x) => x.id === fieldId);
    if (!calendarEvent || !f) {
      this.editing.set(null);
      return true;
    }
    const outcome = evaluateEdit(f, calendarEvent.values, draft);
    if (outcome.invalid) {
      this.editing.set({ ...current, invalid: true });
      const message = (outcome.message ? this.labels().editRefused?.(this.titleOf(calendarEvent), f.header, outcome.message) : undefined) ?? this.labels().editInvalid?.(this.titleOf(calendarEvent), f.header);
      if (message) this.statusMessage.set(message);
      return false;
    }
    this.editing.set(null);
    if (outcome.changed) {
      this.history = recordEdit(this.history, { ownerId: eventId, fieldId, value: outcome.value, previous: outcome.previous });
      this.fieldEdit.emit({ eventId, fieldId, value: outcome.value, previous: outcome.previous });
      const message = this.labels().editAnnouncement?.(this.titleOf(calendarEvent), f.header, outcome.text);
      if (message) this.statusMessage.set(message);
    }
    if (refocus) this.focusFieldButton(eventId, fieldId);
    return true;
  }

  /** Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (Ctrl+Y): put an earlier value back, or re-apply it, through `fieldEdit`. */
  private stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(this.history) : redoEdit(this.history);
    if (!step.record) return;
    this.history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    this.fieldEdit.emit({ eventId: ownerId, fieldId, value: restored, previous: replaced });
    const calendarEvent = this.eventById().get(ownerId);
    const f = this.resolvedFields().find((x) => x.id === fieldId);
    if (!calendarEvent || !f) return;
    const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(calendarEvent.values ?? {}), [fieldId]: restored }) : String(restored);
    const message = (direction === "undo" ? this.labels().undoAnnouncement : this.labels().redoAnnouncement)?.(this.titleOf(calendarEvent), f.header, text);
    if (message) this.statusMessage.set(message);
  }

  /** Undo / redo from anywhere in the calendar except inside a field editor (which keeps the browser's own undo). */
  protected onRootKeydown(event: KeyboardEvent): void {
    if (!this.editableFields() || (event.target as HTMLElement).closest(".calendar-view-field-editor, input, select, textarea")) return;
    const action = historyKey(event);
    if (!action) return;
    event.preventDefault();
    this.stepHistory(action);
  }

  private cancelFieldEdit(): void {
    const current = this.editing();
    if (!current) return;
    this.editing.set(null);
    this.focusFieldButton(current.eventId, current.fieldId);
  }

  protected onEditorInput(event: Event): void {
    const current = this.editing();
    if (current) this.editing.set({ ...current, draft: (event.target as HTMLInputElement).value, invalid: false });
  }

  protected onEditorSelectChange(event: Event): void {
    this.onEditorInput(event);
    this.commitFieldEdit();
  }

  protected onEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      this.commitFieldEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.cancelFieldEdit();
    } else if (event.key === "Tab" && this.editing()) {
      // Tab commits and moves to the event's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const current = this.editing()!;
      const calendarEvent = this.eventById().get(current.eventId);
      const next = neighbourField(this.resolvedFields().filter((x) => this.isFieldEditable(x)), current.fieldId, event.shiftKey);
      if (calendarEvent && next) {
        event.preventDefault();
        if (this.commitFieldEdit(false)) this.startFieldEdit(calendarEvent, next);
      } else {
        this.commitFieldEdit(false);
      }
    }
  }

  /** The first and last day an event covers. */
  private eventSpan(calendarEvent: CalendarEvent): { start: string; end: string } | null {
    return calendarEvent.date
      ? { start: calendarEvent.date, end: calendarEvent.date }
      : calendarEvent.start && calendarEvent.end
        ? { start: calendarEvent.start, end: calendarEvent.end }
        : null;
  }

  protected readonly exportEvents = computed(() => {
    const dated = this.shownEvents().filter((e) => this.eventSpan(e) !== null);
    const periodStart = this.periodStart();
    const periodEnd = this.periodEnd();
    const kept =
      this.exportScope() === "all"
        ? dated
        : dated.filter((e) => {
            const span = this.eventSpan(e)!;
            return span.start <= periodEnd && span.end >= periodStart;
          });
    return kept.sort((a, b) => this.eventSpan(a)!.start.localeCompare(this.eventSpan(b)!.start));
  });
  protected readonly hasExportButtons = computed(() => {
    const l = this.labels();
    return !!l.exportHeaders && !!(l.copy || l.exportCsv || l.exportTsv || l.exportExcel);
  });

  private async finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    this.copy.emit(copied);
    if (this.copyHandler()?.(copied) === false) return;
    const ok = await copyToClipboard(text);
    const message = ok ? this.labels().copyAnnouncement?.(table.rows.length) : this.labels().copyFailed;
    if (message) this.statusMessage.set(message);
  }

  protected runExport(format: ExportFormat | "copy"): void {
    const h = this.labels().exportHeaders;
    if (!h) return;
    const fields = exportableFields(this.resolvedFields());
    const headers = [h.title, h.start, h.end, ...fields.map((f) => f.header)];
    const body = this.exportEvents().map((calendarEvent) => {
      const span = this.eventSpan(calendarEvent)!;
      return [
        this.titleOf(calendarEvent),
        civilDateToDate(span.start),
        civilDateToDate(span.end),
        ...fields.map((f) => exportFieldCell(f, calendarEvent.values)),
      ];
    });
    if (format === "copy") {
      void this.finishCopy({ headers, rows: body });
      return;
    }
    const filename = exportFilename(this.exportFilename(), format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: this.exportFilename() });
    const file: CalendarExport = { format, filename, eventCount: body.length, blob };
    this.exportFile.emit(file);
    if (this.exportHandler()?.(file) === false) return;
    downloadBlob(blob, filename);
    const message = this.labels().exportAnnouncement?.(format, body.length, filename);
    if (message) this.statusMessage.set(message);
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
    const calendarEvent = id ? this.eventById().get(id) : undefined;
    if (calendarEvent) this.moveEventTo(calendarEvent, isoDate);
  }

  protected eventTitle(event: CalendarEvent): string {
    return typeof event["title"] === "string" ? (event["title"] as string) : "";
  }

  protected outsidePeriod(d: string): boolean {
    return isOutsidePeriod(this.shownView(), d, this.anchorDate());
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

  /** The labels of the ranges a day is in, joined for a cell's description; null when none has one. */
  protected rangeLabelsOf(d: string): string | null {
    const text = (this.rangesByDay().get(d) ?? []).map((r) => r.label).filter((l): l is string => !!l).join(", ");
    return text === "" ? null : text;
  }
  protected rangesOf(d: string): CalendarRange[] {
    return this.rangesByDay().get(d) ?? [];
  }

  protected rangeKinds(d: string): string | null {
    const kinds = (this.rangesByDay().get(d) ?? []).map((r) => r.kind ?? "range");
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

  // minDate / maxDate bound navigation as well as picking.
  protected readonly atMinLimit = computed(() => !!this.minDate() && this.periodStart() <= this.minDate());
  protected readonly atMaxLimit = computed(() => !!this.maxDate() && this.periodEnd() >= this.maxDate());
  protected readonly todayOutOfRange = computed(() => {
    const today = this.today();
    return !today || (!!this.minDate() && today < this.minDate()) || (!!this.maxDate() && today > this.maxDate());
  });
  private clampDate(isoDate: string): string {
    const min = this.minDate();
    const max = this.maxDate();
    return min && isoDate < min ? min : max && isoDate > max ? max : isoDate;
  }
  private announceLimit(limit: "min" | "max"): void {
    const date = limit === "min" ? this.minDate() : this.maxDate();
    const message = date ? this.labels().rangeLimit?.(limit, date) : undefined;
    if (message) this.statusMessage.set(message);
  }

  // The period is announced whenever it changes, whatever changed it: Previous / Next / Today, a view switch, a keyboard move
  // across the edge, or the consumer setting `anchorDate` or `view`. The first run says nothing.
  private announcedPeriod: string | undefined;
  private readonly periodAnnouncement = effect(() => {
    const view = this.shownView();
    const start = this.periodStart();
    const end = this.periodEnd();
    const key = `${view}|${start}|${end}`;
    if (this.announcedPeriod === undefined) {
      this.announcedPeriod = key;
      return;
    }
    if (key === this.announcedPeriod) return;
    this.announcedPeriod = key;
    const message = this.labels().periodAnnouncement?.(view, start, end);
    if (message) this.statusMessage.set(message);
  });

  /** Announce how many events match after the search changes (not on the first run). */
  private searchAnnounced = false;
  private readonly searchAnnouncement = effect(() => {
    this.search();
    const matched = this.shownEvents().length;
    if (!this.searchAnnounced) {
      this.searchAnnounced = true;
      return;
    }
    const message = this.labels().searchAnnouncement?.(matched, this.events().length);
    if (message) this.statusMessage.set(message);
  });

  /** Escape in the search field clears it. */
  protected onSearchKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    if (e.key === "Escape" && this.search() !== "") {
      e.preventDefault();
      this.search.set("");
    }
  }

  protected titleSegments(event: CalendarEvent) {
    return highlightSegments(this.titleOf(event), this.search());
  }

  private navigateTo(nextAnchor: string): void {
    this.anchorDate.set(nextAnchor);
    const [start, end] = periodRange(this.shownView(), nextAnchor, this.firstDay());
    this.navigate.emit({ view: this.shownView(), start, end });
  }

  protected stepView(delta: 1 | -1): void {
    if (delta < 0 && this.atMinLimit()) return this.announceLimit("min");
    if (delta > 0 && this.atMaxLimit()) return this.announceLimit("max");
    const anchor = this.anchorDate();
    if (this.shownView() === "day") this.navigateTo(addDays(anchor, delta));
    else if (this.shownView() === "week") this.navigateTo(addDays(anchor, delta * 7));
    else if (this.shownView() === "four-week") this.navigateTo(addDays(anchor, delta * 28));
    else this.navigateTo(addMonths(anchor, delta));
  }

  protected goToday(): void {
    const today = this.today();
    if (!today || this.todayOutOfRange()) return;
    this.navigateTo(today);
  }

  protected setView(next: CalendarViewMode): void {
    this.view.set(next);
    this.pickedOnPurpose.set(true);
    const [start, end] = periodRange(next, this.anchorDate(), this.firstDay());
    this.navigate.emit({ view: next, start, end });
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
  private moveCursor(requested: string): void {
    const next = this.clampDate(requested);
    if (next !== requested) this.announceLimit(requested < next ? "min" : "max");
    this.cursor.set(next);
    const view = this.shownView();
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
    if (this.shownView() === "day") this.moveCursor(addDays(cursor, delta));
    else if (this.shownView() === "week") this.moveCursor(addDays(cursor, delta * 7));
    else if (this.shownView() === "four-week") this.moveCursor(addDays(cursor, delta * 28));
    else this.moveCursor(addMonths(cursor, delta));
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    // The horizontal arrows are visual: in a right-to-left layout the next day is on the left, so ArrowLeft goes forward.
    const key = logicalKey(event.key, isRtl(event.target as Element));
    if (this.moveEvents() && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
      const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset["date"];
      const calendarEvent = el?.dataset["eventId"] ? this.eventById().get(el.dataset["eventId"]) : undefined;
      if (el && fromDate && calendarEvent) {
        event.preventDefault();
        const week = this.shownView() === "day" ? 1 : 7;
        const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[key]!;
        this.moveEventTo(calendarEvent, addDays(fromDate, delta));
        return;
      }
    }
    const cursor = this.effectiveCursor();
    const offset = this.shownView() === "day" ? 0 : (weekdayOf(cursor) - this.firstDay() + 7) % 7;
    const extending = event.shiftKey && CalendarView.MOVE_KEYS.has(event.key);
    if (extending && this.rangeAnchor === null) {
      this.rangeAnchor = this.selectedDate() && !this.selectedRange() ? this.selectedDate()! : cursor;
    }
    if (!extending && CalendarView.MOVE_KEYS.has(event.key)) this.rangeAnchor = null;
    switch (key) {
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
        this.moveCursor(addDays(cursor, this.shownView() === "day" ? -1 : -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveCursor(addDays(cursor, this.shownView() === "day" ? 1 : 7));
        break;
      case "Home":
        event.preventDefault();
        this.moveCursor(addDays(cursor, -offset));
        break;
      case "End":
        event.preventDefault();
        this.moveCursor(addDays(cursor, this.shownView() === "day" ? 0 : 6 - offset));
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
