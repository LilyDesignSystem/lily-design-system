/**
 * `<lily-calendar-view>` — Lily Design System Web Components helper.
 *
 * See `./spec/index.md` for the contract; it ports the canonical Svelte
 * spec. This file implements the custom-element class but does NOT
 * register it. The `index.ts` barrel registers it on import.
 *
 * A headless calendar: a week, a rolling four weeks, or a padded month,
 * with previous/next/today navigation, a view switcher, WAI-ARIA APG grid
 * roving-tabindex keyboard navigation, a picked day, disabled days and
 * consumer-rendered events per day.
 *
 * The table structure (`calendar-table`/`calendar-table-th`/
 * `calendar-table-td`/…) is this catalog's markup CONTRACT, documented in
 * `@lilydesignsystem/web-components-headless`'s `components/calendar-table*.html`
 * reference files — static templates, not JS classes — so this element
 * builds the class names/attributes by hand, exclusively via
 * `document.createElement`/`appendChild` (never `innerHTML`: a
 * `thead`/`tbody`/`tr`/`th`/`td` start tag is dropped by the HTML parser
 * outside a real table's insertion mode).
 *
 * Civil-date arithmetic is `@lilydesignsystem/web-components-date-time-picker`'s,
 * reused rather than re-derived.
 */
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
} from "@lilydesignsystem/web-components-date-time-picker";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data.js";
import { civilDateToDate } from "./cell-types.js";
import { highlightSegments, matchesSearch } from "./search-text.js";
import { isRtl, logicalKey } from "./direction.js";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history.js";
import {
    draftOf,
    editorKind,
    evaluateEdit,
    exportFieldCell,
    exportableFields,
    fieldText,
    isEditableField,
    neighbourField,
    resolveFields,
    type Draft,
    type FieldDef,
    type ResolvedField,
} from "./typed-fields.js";

/**
 * A typed field an event carries (a room, a status, a cost), shown after the event's title in the agenda and read from
 * `event.values[id]`. A bundle of display, sort and export defaults from the data grid's cell types.
 */
export type CalendarEventField = FieldDef;

/** What `onExport` and the `exportfile` event receive. Return `false` from `onExport` to take over the download. */
export type CalendarExport = { format: ExportFormat; filename: string; eventCount: number; blob: Blob };

/** What `onFieldEdit` and the `fieldedit` event carry. */
export type CalendarFieldEdit = { eventId: string; fieldId: string; value: unknown; previous: unknown };

export type CalendarViewMode = "day" | "week" | "four-week" | "month" | "agenda";

/** A marked range (a holiday, a closure, a school term). `label` is text `renderDay` can show. */
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
    weekView?: string;
    fourWeekView?: string;
    monthView?: string;
    /** Switcher label for the agenda (list) view of the month. Gates its button. */
    agendaView?: string;
    /** Agenda view: the message when the shown month has no events (and `agenda-empty-days` is off). Gates the message. */
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
    /** Switcher label for the one-day view. Gates its button. */
    dayView?: string;
    /** Announced after an event is moved to another day. */
    eventMoveAnnouncement?: (calendarEvent: CalendarEvent, toDate: string) => string;
    /** Visible title of the shown period, rendered between the previous and next buttons. Gates the title. */
    periodTitle?: (view: CalendarViewMode, start: string, end: string) => string;
    /** Text of the "+N more" button on a day that `maxEvents` caps: (hidden count, date). Gates the button. */
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

/** What `renderDay` receives for one day cell. */
export type CalendarViewDayArgs = {
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
    /** Call from an event's own click handler to fire `onEventClick` / `eventclick`. */
    openEvent: (calendarEvent: CalendarEvent) => void;
    /** Call with an event and its element to make it draggable and keyboard-movable (a no-op unless event moving is on). */
    attachEvent: (calendarEvent: CalendarEvent, element: HTMLElement) => void;
    /** The formatted text of one event's typed field (empty when the event has no value for it). For a `renderDay` that shows fields. */
    fieldText: (calendarEvent: CalendarEvent, fieldId: string) => string;
};

/** Detail of the `calendarnavigate` event. */
export type CalendarViewNavigateDetail = { view: CalendarViewMode; start: string; end: string };

/** Mirrors the observed attributes / properties for typing convenience. */
export type CalendarViewProps = {
    label: string;
    view?: CalendarViewMode;
    anchorDate?: string;
    selectedDate?: string;
    today?: string;
    minDate?: string;
    maxDate?: string;
    isDisabled?: (isoDate: string) => boolean;
    showWeekNumbers?: boolean;
    ranges?: CalendarRange[];
    selectedRange?: SelectedRange;
    onRangeSelect?: (start: string, end: string) => void;
    locale?: string;
    events?: CalendarEvent[];
    labels?: CalendarViewLabels;
    onNavigate?: (view: CalendarViewMode, start: string, end: string) => void;
    onDayClick?: (isoDate: string) => void;
    onEventClick?: (calendarEvent: CalendarEvent) => void;
    eventFields?: CalendarEventField[];
    onFieldEdit?: (edit: CalendarFieldEdit) => void;
    editableFields?: boolean;
    exportFilename?: string;
    exportScope?: "period" | "all";
    onExport?: (file: CalendarExport) => boolean | void;
    class?: string;
};

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate: string, firstDayOfWeek: number): string {
    const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
    return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(view: CalendarViewMode, anchorDate: string, firstDayOfWeek: number): string[][] {
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
export function periodRange(view: CalendarViewMode, anchorDate: string, firstDayOfWeek: number): [string, string] {
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
export function isOutsidePeriod(view: CalendarViewMode, isoDate: string, anchorDate: string): boolean {
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

const VIEWS: CalendarViewMode[] = ["day", "week", "four-week", "month", "agenda"];

/** Custom-element class implementing `<lily-calendar-view>`. */
export class CalendarView extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "view", "anchor-date", "selected-date", "today", "min-date", "max-date", "locale", "class", "show-week-numbers", "max-events", "agenda-empty-days", "hide-outside-days", "selection-mode", "move-events", "search", "agenda-below", "no-agenda-date"];
    }

    #events: CalendarEvent[] = [];
    #labels: CalendarViewLabels = {};
    #isDisabled: ((isoDate: string) => boolean) | undefined;
    #onNavigate: ((view: CalendarViewMode, start: string, end: string) => void) | undefined;
    #onDayClick: ((isoDate: string) => void) | undefined;
    #onEventClick: ((calendarEvent: CalendarEvent) => void) | undefined;

    #statusMessage = "";
    /** The roving-tabindex cursor; null until first needed (then the anchor date). */
    #cursor: string | null = null;
    #focusPending = false;

    // Range selection: Shift+arrows extend from an anchor; Enter confirms.
    #ranges: CalendarRange[] = [];
    #selectedRange: SelectedRange | undefined;
    #onRangeSelect: ((start: string, end: string) => void) | undefined;
    #rangeAnchor: string | null = null;
    #weekendDays: number[] | undefined;
    #selectedDates: string[] = [];
    #onEventMove: ((calendarEvent: CalendarEvent, toDate: string) => void) | undefined;
    #onMoreClick: ((isoDate: string) => void) | undefined;
    #draggingEventId: string | null = null;
    #eventFields: CalendarEventField[] | undefined;
    #resolvedFields: { locale: string | undefined; fields: ResolvedField[] } | null = null;
    #onFieldEdit: ((edit: CalendarFieldEdit) => void) | undefined;
    #editableFields = false;
    #exportFilename = "calendar";
    #exportScope: "period" | "all" = "period";
    #onExport: ((file: CalendarExport) => boolean | void) | undefined;
    /** The field being edited, if any: the draft is the editor's text, kept current by the editor's own events (no re-render per keystroke). */
    #editing: { eventId: string; fieldId: string; draft: Draft; invalid?: boolean } | null = null;
    #filter?: (event: CalendarEvent) => boolean;
    #eventCompare?: (a: CalendarEvent, b: CalendarEvent) => number;
    #searchText?: (event: CalendarEvent) => string;
    #onCopy?: (copy: { text: string; rowCount: number }) => boolean | void;
    #history: EditHistory = EMPTY_HISTORY;
    #announcedPeriod: string | undefined;
    #narrow = false;
    #pickedOnPurpose = false;
    #narrowQuery: MediaQueryList | null = null;
    #narrowListener = (): void => {
        this.#narrow = !!this.#narrowQuery?.matches;
        if (!this.#narrowQuery?.matches) this.#pickedOnPurpose = false;
        this.#render();
    };
    static #uid = 0;
    readonly #instanceId = `calendar-view-${++CalendarView.#uid}`;
    /** The events that touch the shown period, kept from the last render for export. */
    #exportEvents: CalendarEvent[] = [];
    static readonly #MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    /** The view in force: the agenda on a narrow screen (with `agendaBelow`), unless the person picked a view on purpose. */
    get #shownView(): CalendarViewMode {
        return this.#narrow && !this.#pickedOnPurpose ? "agenda" : this.view;
    }

    get view(): CalendarViewMode {
        const v = this.getAttribute("view") as CalendarViewMode | null;
        return v && VIEWS.includes(v) ? v : "month";
    }
    set view(v: CalendarViewMode) {
        this.setAttribute("view", v);
    }

    get anchorDate(): string {
        return this.getAttribute("anchor-date") || this.today || "1970-01-01";
    }
    set anchorDate(v: string) {
        this.setAttribute("anchor-date", v);
    }

    get selectedDate(): string {
        return this.getAttribute("selected-date") ?? "";
    }
    set selectedDate(v: string) {
        if (v) this.setAttribute("selected-date", v);
        else this.removeAttribute("selected-date");
    }

    get today(): string {
        return this.getAttribute("today") ?? "";
    }
    set today(v: string) {
        if (v) this.setAttribute("today", v);
        else this.removeAttribute("today");
    }

    get minDate(): string {
        return this.getAttribute("min-date") ?? "";
    }
    set minDate(v: string) {
        if (v) this.setAttribute("min-date", v);
        else this.removeAttribute("min-date");
    }

    get maxDate(): string {
        return this.getAttribute("max-date") ?? "";
    }
    set maxDate(v: string) {
        if (v) this.setAttribute("max-date", v);
        else this.removeAttribute("max-date");
    }

    get locale(): string | undefined {
        return this.getAttribute("locale") ?? undefined;
    }
    set locale(v: string | undefined) {
        if (v) this.setAttribute("locale", v);
        else this.removeAttribute("locale");
    }

    /** Show an ISO week-number column (a row header per week). */
    get showWeekNumbers(): boolean {
        return this.hasAttribute("show-week-numbers");
    }
    set showWeekNumbers(v: boolean) {
        if (v) this.setAttribute("show-week-numbers", "");
        else this.removeAttribute("show-week-numbers");
    }

    /** Marked ranges (holidays, closures): each day inside gets `data-range="{kind}"`. */
    get ranges(): CalendarRange[] {
        return [...this.#ranges];
    }
    set ranges(v: CalendarRange[]) {
        this.#ranges = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    /** The picked range. Shift+arrows extend it from the cursor; Shift+click picks one; Escape clears it. */
    get selectedRange(): SelectedRange | undefined {
        return this.#selectedRange ? { ...this.#selectedRange } : undefined;
    }
    set selectedRange(v: SelectedRange | undefined) {
        this.#selectedRange = v ? { ...v } : undefined;
        this.#render();
    }

    get onRangeSelect(): ((start: string, end: string) => void) | undefined {
        return this.#onRangeSelect;
    }
    set onRangeSelect(fn: ((start: string, end: string) => void) | undefined) {
        this.#onRangeSelect = fn;
    }

    /** Cap on events shown per day; a day with more shows a "+N more" button (`labels.moreEvents`). */
    get maxEvents(): number | undefined {
        const v = this.getAttribute("max-events");
        return v === null || v === "" ? undefined : Number(v);
    }
    set maxEvents(v: number | undefined) {
        if (v == null) this.removeAttribute("max-events");
        else this.setAttribute("max-events", String(v));
    }

    /** Agenda view: also list days with no events. Attribute `agenda-empty-days`. Default false (only days with events). */
    get agendaEmptyDays(): boolean {
        return this.hasAttribute("agenda-empty-days");
    }
    set agendaEmptyDays(v: boolean) {
        if (v) this.setAttribute("agenda-empty-days", "");
        else this.removeAttribute("agenda-empty-days");
    }

    /** Month view: leave days outside the shown month empty (the cell keeps `data-outside-period`). */
    get hideOutsideDays(): boolean {
        return this.hasAttribute("hide-outside-days");
    }
    set hideOutsideDays(v: boolean) {
        if (v) this.setAttribute("hide-outside-days", "");
        else this.removeAttribute("hide-outside-days");
    }

    /** Weekday numbers (0 = Sunday … 6 = Saturday) that are the weekend; those cells get `data-weekend`. */
    get weekendDays(): number[] | undefined {
        return this.#weekendDays?.slice();
    }
    set weekendDays(v: number[] | undefined) {
        this.#weekendDays = v?.slice();
        this.#render();
    }

    /** `"multiple"`: Enter/Space or a click toggles a day in `selectedDates` instead of setting `selectedDate`. */
    get selectionMode(): "single" | "multiple" {
        return this.getAttribute("selection-mode") === "multiple" ? "multiple" : "single";
    }
    set selectionMode(v: "single" | "multiple") {
        this.setAttribute("selection-mode", v);
    }

    /** The picked days in `"multiple"` mode. */
    get selectedDates(): string[] {
        return this.#selectedDates.slice();
    }
    set selectedDates(v: string[]) {
        this.#selectedDates = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    /** Turns on event drag-and-drop and Alt+arrow keys (also on when `onEventMove` is set). */
    get moveEvents(): boolean {
        return this.hasAttribute("move-events") || !!this.#onEventMove;
    }
    set moveEvents(v: boolean) {
        if (v) this.setAttribute("move-events", "");
        else this.removeAttribute("move-events");
    }

    /** Called when an event is moved to another day (drag-and-drop or Alt+arrow keys); also fires `eventmove`. */
    get onEventMove(): ((calendarEvent: CalendarEvent, toDate: string) => void) | undefined {
        return this.#onEventMove;
    }
    set onEventMove(fn: ((calendarEvent: CalendarEvent, toDate: string) => void) | undefined) {
        this.#onEventMove = fn;
        this.#render();
    }

    /** Called with the date when a day's "+N more" button is pressed; also fires `moreclick`. */
    get onMoreClick(): ((isoDate: string) => void) | undefined {
        return this.#onMoreClick;
    }
    set onMoreClick(fn: ((isoDate: string) => void) | undefined) {
        this.#onMoreClick = fn;
    }

    /** Search (attribute `search`): shows only the events whose text contains every word of it (any order, ignoring case and diacritics), in every view; the agenda wraps matches in `<mark class="mark calendar-view-match">`. Exports hold what the search leaves. Escape in the field clears it. */
    get search(): string {
        return this.getAttribute("search") ?? "";
    }
    set search(v: string) {
        this.setAttribute("search", v);
    }
    /** Hides events for which it returns false (a category, owner or status filter). Combines with `search`; both must pass. */
    get filter(): ((event: CalendarEvent) => boolean) | undefined {
        return this.#filter;
    }
    set filter(fn: ((event: CalendarEvent) => boolean) | undefined) {
        this.#filter = fn;
        this.#render();
    }
    /** Orders the events within a day (and so in the agenda). Stable. */
    get eventCompare(): ((a: CalendarEvent, b: CalendarEvent) => number) | undefined {
        return this.#eventCompare;
    }
    set eventCompare(fn: ((a: CalendarEvent, b: CalendarEvent) => number) | undefined) {
        this.#eventCompare = fn;
        this.#render();
    }
    /** The text `search` looks in. Defaults to the event's title and every field's text. */
    get searchText(): ((event: CalendarEvent) => string) | undefined {
        return this.#searchText;
    }
    set searchText(fn: ((event: CalendarEvent) => string) | undefined) {
        this.#searchText = fn;
    }
    /** Show the agenda on a narrow screen: a viewport narrower than this many pixels (attribute `agenda-below`) reads as the agenda view, and goes back to `view` when it is wider. A view the user picks with the switcher is respected. Needs `matchMedia`. */
    get agendaBelow(): number | undefined {
        const v = this.getAttribute("agenda-below");
        return v === null || v === "" ? undefined : Number(v);
    }
    set agendaBelow(v: number | undefined) {
        if (v == null) this.removeAttribute("agenda-below");
        else this.setAttribute("agenda-below", String(v));
    }
    /** Agenda view: show the date beside each day's events (default `true`; attribute `no-agenda-date` hides it visually, keeping it for screen readers). */
    get agendaDate(): boolean {
        return !this.hasAttribute("no-agenda-date");
    }
    set agendaDate(v: boolean) {
        this.toggleAttribute("no-agenda-date", !v);
    }
    /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` event fires first. */
    get onCopy(): ((copy: { text: string; rowCount: number }) => boolean | void) | undefined {
        return this.#onCopy;
    }
    set onCopy(fn: ((copy: { text: string; rowCount: number }) => boolean | void) | undefined) {
        this.#onCopy = fn;
    }

    get events(): CalendarEvent[] {
        return [...this.#events];
    }
    set events(v: CalendarEvent[]) {
        this.#events = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get labels(): CalendarViewLabels {
        return { ...this.#labels };
    }
    set labels(v: CalendarViewLabels | undefined) {
        this.#labels = v && typeof v === "object" ? { ...v } : {};
        this.#render();
    }

    /** Typed event fields, read from `event.values`. The default agenda shows them after each event's title; `renderDay` / `renderAgendaDay` get `fieldText`. Editable types edit in the agenda (click the value; Tab moves to the next) when `onFieldEdit` is set or `editableFields` is on. */
    get eventFields(): CalendarEventField[] | undefined {
        return this.#eventFields ? [...this.#eventFields] : undefined;
    }
    set eventFields(v: CalendarEventField[] | undefined) {
        this.#eventFields = Array.isArray(v) ? v.slice() : undefined;
        this.#resolvedFields = null;
        this.#render();
    }

    /** Called with each accepted field edit; the consumer updates `events`. Setting it turns field editing on. The `fieldedit` event reports the same edit. */
    get onFieldEdit(): ((edit: CalendarFieldEdit) => void) | undefined {
        return this.#onFieldEdit;
    }
    set onFieldEdit(fn: ((edit: CalendarFieldEdit) => void) | undefined) {
        this.#onFieldEdit = fn;
        this.#render();
    }

    /** Turns field editing on without `onFieldEdit` (for a consumer that only listens to the `fieldedit` event; an element cannot see its own listeners). */
    get editableFields(): boolean {
        return this.#editableFields;
    }
    set editableFields(v: boolean) {
        this.#editableFields = !!v;
        this.#render();
    }

    /** The file name without its extension. Default `"calendar"`. */
    get exportFilename(): string {
        return this.#exportFilename;
    }
    set exportFilename(v: string) {
        this.#exportFilename = v || "calendar";
    }

    /** What an export holds: `"period"` (default) is the events that touch the shown period; `"all"` is every event. */
    get exportScope(): "period" | "all" {
        return this.#exportScope;
    }
    set exportScope(v: "period" | "all") {
        this.#exportScope = v === "all" ? "all" : "period";
        this.#render();
    }

    /** Called before the download with the finished file. Return `false` to skip the built-in download. The `exportfile` event reports the same file. */
    get onExport(): ((file: CalendarExport) => boolean | void) | undefined {
        return this.#onExport;
    }
    set onExport(fn: ((file: CalendarExport) => boolean | void) | undefined) {
        this.#onExport = fn;
    }

    /** Extra disabled-day test. Disabled days stay focusable but cannot be picked. */
    get isDisabled(): ((isoDate: string) => boolean) | undefined {
        return this.#isDisabled;
    }
    set isDisabled(fn: ((isoDate: string) => boolean) | undefined) {
        this.#isDisabled = fn;
        this.#render();
    }

    get onNavigate(): ((view: CalendarViewMode, start: string, end: string) => void) | undefined {
        return this.#onNavigate;
    }
    set onNavigate(fn: ((view: CalendarViewMode, start: string, end: string) => void) | undefined) {
        this.#onNavigate = fn;
    }

    get onDayClick(): ((isoDate: string) => void) | undefined {
        return this.#onDayClick;
    }
    set onDayClick(fn: ((isoDate: string) => void) | undefined) {
        this.#onDayClick = fn;
    }

    get onEventClick(): ((calendarEvent: CalendarEvent) => void) | undefined {
        return this.#onEventClick;
    }
    set onEventClick(fn: ((calendarEvent: CalendarEvent) => void) | undefined) {
        this.#onEventClick = fn;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of one day cell: by default its day-of-month number
     * followed by a button per event whose `title` is a string. Override on an
     * instance (or subclass) to render anything else; call `args.openEvent`
     * from your own event controls.
     */
    renderDay(args: CalendarViewDayArgs): Node {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode(String(parseIsoDate(args.date)?.day ?? "")));
        for (const r of args.ranges) {
            if (!r.label) continue;
            const rangeLabel = document.createElement("span");
            rangeLabel.className = "calendar-view-range-label";
            rangeLabel.textContent = r.label;
            fragment.appendChild(rangeLabel);
        }
        for (const event of args.visibleEvents) {
            if (typeof event["title"] !== "string") continue;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "calendar-view-event";
            button.textContent = event["title"] as string;
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                args.openEvent(event);
            });
            args.attachEvent(event, button);
            fragment.appendChild(button);
        }
        const moreText = args.hiddenCount > 0 ? this.#labels.moreEvents?.(args.hiddenCount, args.date) : undefined;
        if (moreText) {
            const more = document.createElement("button");
            more.type = "button";
            more.className = "calendar-view-more-button";
            more.textContent = moreText;
            more.addEventListener("click", (e) => {
                e.stopPropagation();
                this.#onMoreClick?.(args.date);
                this.dispatchEvent(new CustomEvent<string>("moreclick", { detail: args.date, bubbles: true, composed: true }));
            });
            fragment.appendChild(more);
        }
        return fragment;
    }

    /**
     * The events of one agenda day. Default: a list with one `.calendar-view-event` button per event (its
     * `title` when a string, else its id). Override to render your own content.
     */
    renderAgendaDay(args: CalendarViewDayArgs): Node {
        const list = document.createElement("ul");
        list.className = "calendar-view-agenda-events";
        for (const event of args.events) {
            const item = document.createElement("li");
            item.setAttribute("data-event-key", event.id);
            const button = document.createElement("button");
            button.type = "button";
            button.className = "calendar-view-event";
            if (this.search.trim() === "") button.textContent = this.#eventTitle(event);
            else {
                for (const part of highlightSegments(this.#eventTitle(event), this.search)) {
                    if (!part.match) {
                        button.append(document.createTextNode(part.text));
                        continue;
                    }
                    const mark = document.createElement("mark");
                    mark.className = "mark calendar-view-match";
                    mark.textContent = part.text;
                    button.append(mark);
                }
            }
            button.addEventListener("click", () => args.openEvent(event));
            item.appendChild(button);
            const fields = this.#resolved();
            if (fields.length > 0) {
                const fieldsEl = document.createElement("span");
                fieldsEl.className = "calendar-view-event-fields";
                for (const f of fields) {
                    const node = this.#fieldNode(event, f);
                    if (node) fieldsEl.appendChild(node);
                }
                item.appendChild(fieldsEl);
            }
            list.appendChild(item);
        }
        return list;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#watchNarrow();
        this.#render();
    }

    disconnectedCallback(): void {
        this.#narrowQuery?.removeEventListener?.("change", this.#narrowListener);
        this.#narrowQuery = null;
    }

    /** A narrow screen shows the agenda: a viewport narrower than `agenda-below` pixels reads as the agenda view. */
    #watchNarrow(): void {
        this.#narrowQuery?.removeEventListener?.("change", this.#narrowListener);
        this.#narrowQuery = null;
        const below = this.agendaBelow;
        if (below === undefined || typeof matchMedia !== "function") {
            this.#narrow = false;
            return;
        }
        this.#narrowQuery = matchMedia(`(max-width: ${below - 1}px)`);
        this.#narrow = this.#narrowQuery.matches;
        this.#narrowQuery.addEventListener?.("change", this.#narrowListener);
    }

    attributeChangedCallback(name: string, oldValue?: string | null, newValue?: string | null): void {
        if (name === "agenda-below") this.#watchNarrow();
        this.#render();
        // Announce how many events match after the search changes (not when it is first set).
        if (name === "search" && this.isConnected && (oldValue ?? "") !== (newValue ?? "")) {
            this.#announceNow(this.#labels.searchAnnouncement?.(this.#shownEvents().length, this.#events.length));
        }
    }

    /** The events the search and filter leave, in `eventCompare` order. */
    #shownEvents(): CalendarEvent[] {
        const query = this.search;
        const searching = query.trim() !== "";
        const text = this.#searchText ?? ((e: CalendarEvent) => [this.#eventTitle(e), ...this.#resolved().map((f) => fieldText(f, e.values))].join(" "));
        const narrowed = searching || this.#filter ? this.#events.filter((e) => (!this.#filter || this.#filter(e)) && (!searching || matchesSearch(text(e), query))) : this.#events;
        return this.#eventCompare ? [...narrowed].sort(this.#eventCompare) : narrowed;
    }

    /** Say `message` now: into the live region, without waiting for a re-render. */
    #announceNow(message: string | undefined): void {
        if (!message) return;
        this.#statusMessage = message;
        const status = this.querySelector(".calendar-view-status");
        if (status) status.textContent = message;
    }

    // ---- Derived data ----

    #firstDay(): number {
        return firstDayOfWeekFor(this.locale);
    }

    #isDisabledDay(isoDate: string): boolean {
        if (this.minDate && isoDate < this.minDate) return true;
        if (this.maxDate && isoDate > this.maxDate) return true;
        return this.#isDisabled?.(isoDate) ?? false;
    }

    /** The cursor, kept inside the visible days when the period changes from outside. */
    #effectiveCursor(flatDays: string[]): string {
        const cursor = this.#cursor ?? this.anchorDate;
        if (flatDays.includes(cursor)) return cursor;
        return flatDays.includes(this.anchorDate) ? this.anchorDate : flatDays[0];
    }

    #visibleDays(): string[] {
        return periodDays(this.#shownView, this.anchorDate, this.#firstDay()).flat();
    }

    // ---- Actions ----

    #setRange(a: string, b: string, keepFocus: boolean): void {
        const [start, end] = a <= b ? [a, b] : [b, a];
        this.#selectedRange = { start, end };
        const message = this.#labels.rangeAnnouncement?.(start, end);
        if (message) this.#statusMessage = message;
        if (keepFocus) this.#focusPending = true;
        this.#render();
    }

    #confirmRange(): void {
        const range = this.#selectedRange;
        if (!range) return;
        this.#rangeAnchor = null;
        this.#onRangeSelect?.(range.start, range.end);
        this.dispatchEvent(
            new CustomEvent<SelectedRange>("rangeselect", { detail: { ...range }, bubbles: true, composed: true }),
        );
    }

    /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
    #weekNumberOf(row: string[]): number {
        return isoWeek(row.find((d) => weekdayOf(d) === 4) ?? row[0]);
    }

    // ---- Typed fields, inline editing (agenda), export ----

    /** Type defaults (format, compare, export value), resolved once per `eventFields` / `locale` change, never per event or keystroke. */
    #resolved(): ResolvedField[] {
        const locale = this.locale;
        if (!this.#resolvedFields || this.#resolvedFields.locale !== locale) {
            this.#resolvedFields = { locale, fields: resolveFields(this.#eventFields, locale) };
        }
        return this.#resolvedFields.fields;
    }

    #fieldText(calendarEvent: CalendarEvent, fieldId: string): string {
        const f = this.#resolved().find((x) => x.id === fieldId);
        return f ? fieldText(f, calendarEvent.values) : "";
    }

    #eventTitle(calendarEvent: CalendarEvent): string {
        return typeof calendarEvent["title"] === "string" ? (calendarEvent["title"] as string) : calendarEvent.id;
    }

    #isFieldEditable(f: CalendarEventField): boolean {
        return (!!this.#onFieldEdit || this.#editableFields) && isEditableField(f);
    }

    #focusFieldButton(eventId: string, fieldId: string): void {
        const li = Array.from(this.querySelectorAll<HTMLElement>("[data-event-key]")).find((el) => el.dataset.eventKey === eventId);
        const field = Array.from(li?.querySelectorAll<HTMLElement>("[data-field]") ?? []).find((el) => el.dataset.field === fieldId);
        field?.querySelector<HTMLElement>(".calendar-view-field-button")?.focus({ preventScroll: true });
    }

    #startFieldEdit(calendarEvent: CalendarEvent, f: ResolvedField): void {
        if (!this.#isFieldEditable(f)) return;
        this.#editing = { eventId: calendarEvent.id, fieldId: f.id, draft: draftOf(f, calendarEvent.values) };
        this.#render();
        const editor = this.querySelector<HTMLInputElement>(".calendar-view-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    }

    /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
    #commitFieldEdit(refocus = true): boolean {
        const current = this.#editing;
        if (!current) return true;
        const { eventId, fieldId, draft } = current;
        const calendarEvent = this.#events.find((e) => e.id === eventId);
        const f = this.#resolved().find((x) => x.id === fieldId);
        if (!calendarEvent || !f) {
            this.#editing = null;
            this.#render();
            return true;
        }
        const outcome = evaluateEdit(f, calendarEvent.values, draft);
        if (outcome.invalid) {
            this.#editing = { ...current, invalid: true };
            const message = (outcome.message ? this.#labels.editRefused?.(this.#eventTitle(calendarEvent), f.header, outcome.message) : undefined) ?? this.#labels.editInvalid?.(this.#eventTitle(calendarEvent), f.header);
            if (message) this.#statusMessage = message;
            this.#render();
            this.querySelector<HTMLElement>(".calendar-view-field-editor")?.focus({ preventScroll: true });
            return false;
        }
        this.#editing = null;
        if (outcome.changed) {
            this.#history = recordEdit(this.#history, { ownerId: eventId, fieldId, value: outcome.value, previous: outcome.previous });
            const edit: CalendarFieldEdit = { eventId, fieldId, value: outcome.value, previous: outcome.previous };
            this.#onFieldEdit?.(edit);
            this.dispatchEvent(new CustomEvent<CalendarFieldEdit>("fieldedit", { detail: edit, bubbles: true, composed: true }));
            this.#statusMessage = this.#labels.editAnnouncement?.(this.#eventTitle(calendarEvent), f.header, outcome.text) ?? this.#statusMessage;
        }
        this.#render();
        if (refocus) this.#focusFieldButton(eventId, fieldId);
        return true;
    }

    /** Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (Ctrl+Y): put an earlier value back, or re-apply it, through `onFieldEdit` and the `fieldedit` event. */
    #stepHistory(direction: "undo" | "redo"): void {
        const step = direction === "undo" ? undoEdit(this.#history) : redoEdit(this.#history);
        if (!step.record) return;
        this.#history = step.history;
        const { ownerId, fieldId, value, previous } = step.record;
        const restored = direction === "undo" ? previous : value;
        const replaced = direction === "undo" ? value : previous;
        const edit: CalendarFieldEdit = { eventId: ownerId, fieldId, value: restored, previous: replaced };
        this.#onFieldEdit?.(edit);
        this.dispatchEvent(new CustomEvent<CalendarFieldEdit>("fieldedit", { detail: edit, bubbles: true, composed: true }));
        const calendarEvent = this.#events.find((e) => e.id === ownerId);
        const f = this.#resolved().find((x) => x.id === fieldId);
        if (!calendarEvent || !f) return;
        const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(calendarEvent.values ?? {}), [fieldId]: restored }) : String(restored);
        this.#announceNow((direction === "undo" ? this.#labels.undoAnnouncement : this.#labels.redoAnnouncement)?.(this.#eventTitle(calendarEvent), f.header, text));
    }

    /** Undo / redo from anywhere in the calendar except inside a field editor (which keeps the browser's own undo). */
    #onRootKeydown(event: KeyboardEvent): void {
        if (!(this.#onFieldEdit || this.#editableFields) || (event.target as HTMLElement).closest(".calendar-view-field-editor, input, select, textarea")) return;
        const action = historyKey(event);
        if (!action) return;
        event.preventDefault();
        this.#stepHistory(action);
    }

    #cancelFieldEdit(): void {
        const current = this.#editing;
        if (!current) return;
        this.#editing = null;
        this.#render();
        this.#focusFieldButton(current.eventId, current.fieldId);
    }

    #onEditorKeydown(event: KeyboardEvent): void {
        // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
        // report the confirming Enter with `isComposing` already false but keyCode 229.
        event.stopPropagation();
        if (event.isComposing || event.keyCode === 229) return;
        if (event.key === "Enter") {
            event.preventDefault();
            this.#commitFieldEdit();
        } else if (event.key === "Escape") {
            event.preventDefault();
            this.#cancelFieldEdit();
        } else if (event.key === "Tab" && this.#editing) {
            // Tab commits and moves to the event's next (Shift+Tab: previous) editable field; past the last, it moves on.
            const current = this.#editing;
            const calendarEvent = this.#events.find((e) => e.id === current.eventId);
            const next = neighbourField(this.#resolved().filter((x) => this.#isFieldEditable(x)), current.fieldId, event.shiftKey);
            if (calendarEvent && next) {
                event.preventDefault();
                if (this.#commitFieldEdit(false)) this.#startFieldEdit(this.#events.find((e) => e.id === calendarEvent.id) ?? calendarEvent, next);
            } else {
                this.#commitFieldEdit(false);
            }
        }
    }

    /** One field's node: its name and either the value, a button that opens the editor, or the editor itself. */
    #fieldNode(calendarEvent: CalendarEvent, f: ResolvedField): HTMLElement | null {
        const text = fieldText(f, calendarEvent.values);
        const editable = this.#isFieldEditable(f);
        const nameId = `calendar-view-fn-${calendarEvent.id}-${f.id}`;
        const valueId = `calendar-view-fv-${calendarEvent.id}-${f.id}`;
        const editing = this.#editing;
        const isEditing = !!editing && editing.eventId === calendarEvent.id && editing.fieldId === f.id;
        if (!isEditing && text === "" && !editable) return null;
        const span = document.createElement("span");
        span.className = "calendar-view-event-field";
        span.setAttribute("data-field", f.id);
        const name = document.createElement("span");
        name.className = "calendar-view-event-field-name";
        name.id = nameId;
        name.textContent = f.header;
        span.appendChild(name);
        span.appendChild(document.createTextNode(" "));
        if (isEditing && editing) {
            span.setAttribute("data-editing", "");
            const kind = editorKind(f);
            if (kind === "select" || kind === "radio") {
                const select = document.createElement("select");
                select.className = "calendar-view-field-editor";
                select.setAttribute("aria-label", f.editLabel ?? f.header);
                if (editing.invalid) select.setAttribute("aria-invalid", "true");
                const blank = document.createElement("option");
                blank.value = "";
                select.appendChild(blank);
                for (const option of f.options ?? []) {
                    const o = document.createElement("option");
                    o.value = option.id;
                    o.disabled = !!option.disabled;
                    o.textContent = option.label;
                    select.appendChild(o);
                }
                select.value = String(editing.draft ?? "");
                select.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
                select.addEventListener("change", () => {
                    editing.draft = select.value;
                    this.#commitFieldEdit();
                });
                select.addEventListener("blur", () => this.#commitFieldEdit(false));
                span.appendChild(select);
            } else {
                const input = document.createElement("input");
                input.className = "calendar-view-field-editor";
                input.setAttribute("aria-label", f.editLabel ?? f.header);
                if (editing.invalid) input.setAttribute("aria-invalid", "true");
                input.type = kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text";
                if (kind === "number") input.setAttribute("inputmode", "decimal");
                input.value = String(editing.draft ?? "");
                input.addEventListener("input", () => {
                    editing.draft = input.value;
                    editing.invalid = false;
                    input.removeAttribute("aria-invalid");
                });
                input.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
                input.addEventListener("blur", () => this.#commitFieldEdit(false));
                span.appendChild(input);
            }
            return span;
        }
        span.setAttribute("data-type", f.type ?? "text");
        if (editable) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "calendar-view-field-button";
            button.id = valueId;
            button.setAttribute("aria-labelledby", `${nameId} ${valueId}`);
            button.textContent = text;
            button.addEventListener("click", () => this.#startFieldEdit(calendarEvent, f));
            span.appendChild(button);
        } else {
            const value = document.createElement("span");
            value.className = "calendar-view-event-field-value";
            value.textContent = text;
            span.appendChild(value);
        }
        return span;
    }

    /** The first and last day an event covers. */
    #eventSpan(calendarEvent: CalendarEvent): { start: string; end: string } | null {
        return calendarEvent.date
            ? { start: calendarEvent.date, end: calendarEvent.date }
            : calendarEvent.start && calendarEvent.end
              ? { start: calendarEvent.start, end: calendarEvent.end }
              : null;
    }

    async #finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
        const text = toClipboardText(table);
        const copied = { text, rowCount: table.rows.length };
        this.dispatchEvent(new CustomEvent("copy", { detail: copied, bubbles: true, composed: true }));
        if (this.#onCopy?.(copied) === false) return;
        const ok = await copyToClipboard(text);
        this.#announceNow(ok ? this.#labels.copyAnnouncement?.(table.rows.length) : this.#labels.copyFailed);
    }

    #runExport(format: ExportFormat | "copy"): void {
        const h = this.#labels.exportHeaders;
        if (!h) return;
        const fields = exportableFields(this.#resolved());
        const headers = [h.title, h.start, h.end, ...fields.map((f) => f.header)];
        const body = this.#exportEvents.map((calendarEvent) => {
            const span = this.#eventSpan(calendarEvent)!;
            return [
                this.#eventTitle(calendarEvent),
                civilDateToDate(span.start),
                civilDateToDate(span.end),
                ...fields.map((f) => exportFieldCell(f, calendarEvent.values)),
            ];
        });
        if (format === "copy") {
            void this.#finishCopy({ headers, rows: body });
            return;
        }
        const filename = exportFilename(this.#exportFilename, format);
        const blob = exportBlob({ headers, rows: body }, format, { sheetName: this.#exportFilename });
        const file: CalendarExport = { format, filename, eventCount: body.length, blob };
        this.dispatchEvent(new CustomEvent<CalendarExport>("exportfile", { detail: file, bubbles: true, composed: true }));
        if (this.#onExport?.(file) === false) return;
        downloadBlob(blob, filename);
        const message = this.#labels.exportAnnouncement?.(format, body.length, filename);
        if (message) {
            this.#statusMessage = message;
            const status = this.querySelector(".calendar-view-status");
            if (status) status.textContent = message;
        }
    }

    // ---- Event drag-and-drop (supplementary pointer path) + Alt+arrow keys ----

    #attachEvent(calendarEvent: CalendarEvent, element: HTMLElement): void {
        if (!this.moveEvents) return;
        element.setAttribute("draggable", "true");
        element.setAttribute("data-event-id", calendarEvent.id);
        element.addEventListener("dragstart", (e) => {
            this.#draggingEventId = calendarEvent.id;
            (e as DragEvent).dataTransfer?.setData("text/plain", calendarEvent.id);
        });
    }

    #moveEventTo(calendarEvent: CalendarEvent, toDate: string): void {
        if (!this.moveEvents || this.#isDisabledDay(toDate)) return;
        this.#onEventMove?.(calendarEvent, toDate);
        this.dispatchEvent(
            new CustomEvent<{ event: CalendarEvent; toDate: string }>("eventmove", {
                detail: { event: calendarEvent, toDate },
                bubbles: true,
                composed: true,
            }),
        );
        const message = this.#labels.eventMoveAnnouncement?.(calendarEvent, toDate);
        if (message) {
            this.#statusMessage = message;
            this.#render();
        }
    }

    #pick(isoDate: string): void {
        if (this.#isDisabledDay(isoDate)) return;
        this.#cursor = isoDate;
        if (this.selectionMode === "multiple") {
            this.#selectedDates = this.#selectedDates.includes(isoDate)
                ? this.#selectedDates.filter((d) => d !== isoDate)
                : [...this.#selectedDates, isoDate].sort();
        } else {
            this.selectedDate = isoDate;
        }
        this.#onDayClick?.(isoDate);
        this.dispatchEvent(new CustomEvent<string>("dayclick", { detail: isoDate, bubbles: true, composed: true }));
    }

    #openEvent(calendarEvent: CalendarEvent): void {
        this.#onEventClick?.(calendarEvent);
        this.dispatchEvent(
            new CustomEvent<CalendarEvent>("eventclick", { detail: calendarEvent, bubbles: true, composed: true }),
        );
    }

    /** minDate / maxDate bound navigation as well as picking. */
    #atMinLimit(): boolean {
        return !!this.minDate && periodRange(this.#shownView, this.anchorDate, this.#firstDay())[0] <= this.minDate;
    }
    #atMaxLimit(): boolean {
        return !!this.maxDate && periodRange(this.#shownView, this.anchorDate, this.#firstDay())[1] >= this.maxDate;
    }
    #todayOutOfRange(): boolean {
        return !this.today || (!!this.minDate && this.today < this.minDate) || (!!this.maxDate && this.today > this.maxDate);
    }
    #clampDate(isoDate: string): string {
        return this.minDate && isoDate < this.minDate ? this.minDate : this.maxDate && isoDate > this.maxDate ? this.maxDate : isoDate;
    }
    #announceLimit(limit: "min" | "max"): void {
        const date = limit === "min" ? this.minDate : this.maxDate;
        if (date) this.#announceNow(this.#labels.rangeLimit?.(limit, date));
    }

    /** Fire navigation for the current state; the period announcement itself is made by `#render`, whatever changed the period. */
    #emitNavigate(view: CalendarViewMode, anchor: string): void {
        const [start, end] = periodRange(view, anchor, this.#firstDay());
        this.#onNavigate?.(view, start, end);
        this.dispatchEvent(
            new CustomEvent<CalendarViewNavigateDetail>("calendarnavigate", {
                detail: { view, start, end },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #navigateTo(nextAnchor: string): void {
        this.setAttribute("anchor-date", nextAnchor);
        this.#emitNavigate(this.#shownView, nextAnchor);
        this.#render();
    }

    #stepView(delta: 1 | -1): void {
        if (delta < 0 && this.#atMinLimit()) return this.#announceLimit("min");
        if (delta > 0 && this.#atMaxLimit()) return this.#announceLimit("max");
        const anchor = this.anchorDate;
        if (this.#shownView === "day") this.#navigateTo(addDays(anchor, delta));
        else if (this.#shownView === "week") this.#navigateTo(addDays(anchor, delta * 7));
        else if (this.#shownView === "four-week") this.#navigateTo(addDays(anchor, delta * 28));
        else this.#navigateTo(addMonths(anchor, delta));
    }

    #goToday(): void {
        if (!this.today || this.#todayOutOfRange()) return;
        this.#navigateTo(this.today);
    }

    #setView(next: CalendarViewMode): void {
        this.#pickedOnPurpose = true;
        this.setAttribute("view", next);
        this.#emitNavigate(next, this.anchorDate);
        this.#render();
    }

    /** Move the cursor, re-paging the visible period when it leaves it. */
    #moveCursor(requested: string): void {
        const next = this.#clampDate(requested);
        if (next !== requested) this.#announceLimit(requested < next ? "min" : "max");
        this.#cursor = next;
        const view = this.#shownView;
        const anchorDate = this.anchorDate;
        if (view === "month") {
            const cp = parseIsoDate(next);
            const anchor = parseIsoDate(anchorDate);
            if (cp && anchor && (cp.year !== anchor.year || cp.month !== anchor.month)) {
                this.setAttribute("anchor-date", formatIsoDate({ year: cp.year, month: cp.month, day: 1 }));
                this.#emitNavigate(view, this.anchorDate);
            }
        } else if (view === "day") {
            if (next !== this.anchorDate) this.#navigateTo(next);
        } else {
            const len = view === "week" ? 7 : 28;
            let start = weekStart(anchorDate, this.#firstDay());
            let moved = false;
            if (next < start) {
                while (next < start) start = addDays(start, -7);
                moved = true;
            } else {
                let end = addDays(start, len - 1);
                if (next > end) {
                    while (next > end) {
                        start = addDays(start, 7);
                        end = addDays(start, len - 1);
                    }
                    moved = true;
                }
            }
            if (moved) {
                this.setAttribute("anchor-date", start);
                this.#emitNavigate(view, start);
            }
        }
        this.#focusPending = true;
        this.#render();
    }

    #pageCursor(delta: 1 | -1, cursor: string): void {
        if (this.#shownView === "day") this.#moveCursor(addDays(cursor, delta));
        else if (this.#shownView === "week") this.#moveCursor(addDays(cursor, delta * 7));
        else if (this.#shownView === "four-week") this.#moveCursor(addDays(cursor, delta * 28));
        else this.#moveCursor(addMonths(cursor, delta));
    }

    #onGridKeydown(event: KeyboardEvent): void {
        // The horizontal arrows are visual: in a right-to-left layout the next day is on the left, so ArrowLeft goes forward.
        const key = logicalKey(event.key, isRtl(event.target as Element));
        const cursor = this.#effectiveCursor(this.#visibleDays());
        if (this.moveEvents && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
            const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
            const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset.date;
            const calendarEvent = this.#events.find((e) => e.id === el?.dataset.eventId);
            if (el && fromDate && calendarEvent) {
                event.preventDefault();
                const week = this.#shownView === "day" ? 1 : 7;
                const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[key]!;
                this.#moveEventTo(calendarEvent, addDays(fromDate, delta));
                return;
            }
        }
        const offset = this.#shownView === "day" ? 0 : (weekdayOf(cursor) - this.#firstDay() + 7) % 7;
        const extending = event.shiftKey && CalendarView.#MOVE_KEYS.has(event.key);
        if (extending && this.#rangeAnchor === null) {
            this.#rangeAnchor = this.selectedDate && !this.#selectedRange ? this.selectedDate : cursor;
        }
        if (!extending && CalendarView.#MOVE_KEYS.has(event.key)) this.#rangeAnchor = null;
        switch (key) {
            case "ArrowLeft":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, -1));
                break;
            case "ArrowRight":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, 1));
                break;
            case "ArrowUp":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, this.#shownView === "day" ? -1 : -7));
                break;
            case "ArrowDown":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, this.#shownView === "day" ? 1 : 7));
                break;
            case "Home":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, -offset));
                break;
            case "End":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, this.#shownView === "day" ? 0 : 6 - offset));
                break;
            case "PageUp":
                event.preventDefault();
                this.#pageCursor(-1, cursor);
                break;
            case "PageDown":
                event.preventDefault();
                this.#pageCursor(1, cursor);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (this.#rangeAnchor !== null && this.#selectedRange) {
                    this.#confirmRange();
                } else {
                    this.#pick(cursor);
                }
                this.#focusPending = true;
                this.#render();
                break;
            case "Escape":
                if (this.#selectedRange || this.#rangeAnchor !== null) {
                    event.preventDefault();
                    this.#rangeAnchor = null;
                    this.#selectedRange = undefined;
                    this.#focusPending = true;
                    this.#render();
                }
                break;
            case "t":
            case "T": {
                if (!this.today || event.ctrlKey || event.metaKey || event.altKey) break;
                event.preventDefault();
                this.setAttribute("anchor-date", this.today);
                this.#emitNavigate(this.#shownView, this.today);
                this.#moveCursor(this.today);
                break;
            }
            default:
                break;
        }
        if (extending && this.#rangeAnchor !== null && this.#cursor !== null) {
            this.#setRange(this.#rangeAnchor, this.#cursor, true);
        }
    }

    // ---- Rendering ----

    #button(className: string, text: string, onClick: () => void, extra: Record<string, string> = {}): HTMLButtonElement {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = text;
        for (const [k, v] of Object.entries(extra)) button.setAttribute(k, v);
        button.addEventListener("click", onClick);
        return button;
    }

    #render(): void {
        if (!this.isConnected) return;

        const labels = this.#labels;
        const view = this.#shownView;
        const anchorDate = this.anchorDate;
        const firstDay = this.#firstDay();
        const days = periodDays(view, anchorDate, firstDay);
        const flatDays = days.flat();
        const cursor = this.#effectiveCursor(flatDays);
        this.#cursor = cursor;
        const shownEvents = this.#shownEvents();
        const eventMap = eventsByDay(shownEvents);
        // The period is announced whenever it changes, whatever changed it: Previous / Next / Today, a view switch, a keyboard move
        // across the edge, or the consumer setting `anchor-date` or `view`. The first render says nothing.
        {
            const [pStart, pEnd] = periodRange(view, anchorDate, firstDay);
            const key = `${view}|${pStart}|${pEnd}`;
            if (this.#announcedPeriod !== undefined && key !== this.#announcedPeriod && labels.periodAnnouncement) {
                this.#statusMessage = labels.periodAnnouncement(view, pStart, pEnd);
            }
            this.#announcedPeriod = key;
        }
        // The marked ranges per visible day, found once per render rather than once per cell.
        const rangesByDay = new Map<string, CalendarRange[]>();
        if (this.#ranges.length > 0) {
            const shown = view === "agenda" ? (() => {
                const [aStart, aEnd] = periodRange("agenda", anchorDate, firstDay);
                const out: string[] = [];
                for (let d = aStart; d <= aEnd; d = addDays(d, 1)) out.push(d);
                return out;
            })() : flatDays;
            for (const d of shown) {
                const hit = this.#ranges.filter((r) => d >= r.start && d <= r.end);
                if (hit.length > 0) rangesByDay.set(d, hit);
            }
        }
        const NO_RANGES: CalendarRange[] = [];
        const selectedDateSet = new Set(this.#selectedDates);
        {
            const dated = shownEvents.filter((e) => this.#eventSpan(e) !== null);
            const [pStart, pEnd] = periodRange(view, anchorDate, firstDay);
            this.#exportEvents = (
                this.#exportScope === "all"
                    ? dated.slice()
                    : dated.filter((e) => {
                          const span = this.#eventSpan(e)!;
                          return span.start <= pEnd && span.end >= pStart;
                      })
            ).sort((a, b) => this.#eventSpan(a)!.start.localeCompare(this.#eventSpan(b)!.start));
        }

        const root = document.createElement("div");
        root.className = `calendar-view ${this.getAttribute("class") ?? ""}`.trim();
        root.addEventListener("keydown", (e) => this.#onRootKeydown(e));

        if (labels.periodTitle || labels.dayView || labels.weekView || labels.fourWeekView || labels.monthView || labels.agendaView) {
            const toolbar = document.createElement("div");
            toolbar.className = "calendar-view-toolbar";

            const switcher = document.createElement("div");
            switcher.className = "calendar-view-switcher";
            switcher.setAttribute("role", "group");
            const entries: [CalendarViewMode, string | undefined][] = [
                ["day", labels.dayView],
                ["week", labels.weekView],
                ["four-week", labels.fourWeekView],
                ["month", labels.monthView],
                ["agenda", labels.agendaView],
            ];
            for (const [mode, text] of entries) {
                if (!text) continue;
                switcher.appendChild(
                    this.#button(
                        `calendar-view-switcher-button calendar-view-switcher-button-${mode}`,
                        text,
                        () => this.#setView(mode),
                        { "aria-pressed": String(view === mode) },
                    ),
                );
            }
            toolbar.appendChild(switcher);

            const nav = document.createElement("div");
            nav.className = "calendar-view-nav";
            const previous = this.#button("calendar-view-previous-button", "‹", () => this.#stepView(-1));
            const previousName = labels.previous?.(view);
            if (previousName) previous.setAttribute("aria-label", previousName);
            if (this.#atMinLimit()) previous.setAttribute("aria-disabled", "true");
            nav.appendChild(previous);
            if (labels.periodTitle) {
                const [titleStart, titleEnd] = periodRange(view, anchorDate, firstDay);
                const title = document.createElement("span");
                title.className = "calendar-view-title";
                title.textContent = labels.periodTitle(view, titleStart, titleEnd);
                nav.appendChild(title);
            }
            if (labels.today) {
                const todayButton = this.#button("calendar-view-today-button", labels.today, () => this.#goToday());
                todayButton.disabled = !this.today;
                if (this.today && this.#todayOutOfRange()) todayButton.setAttribute("aria-disabled", "true");
                nav.appendChild(todayButton);
            }
            const next = this.#button("calendar-view-next-button", "›", () => this.#stepView(1));
            const nextName = labels.next?.(view);
            if (nextName) next.setAttribute("aria-label", nextName);
            if (this.#atMaxLimit()) next.setAttribute("aria-disabled", "true");
            nav.appendChild(next);
            toolbar.appendChild(nav);
            root.appendChild(toolbar);
        }

        if (labels.search) {
            const input = document.createElement("input");
            input.type = "search";
            input.className = "search-input calendar-view-search";
            input.setAttribute("aria-label", labels.search);
            input.value = this.search;
            input.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && this.search !== "") {
                    e.preventDefault();
                    this.setAttribute("search", "");
                    this.querySelector<HTMLInputElement>(".calendar-view-search")?.focus();
                }
            });
            input.addEventListener("input", () => {
                this.setAttribute("search", input.value);
                const again = this.querySelector<HTMLInputElement>(".calendar-view-search");
                again?.focus();
                again?.setSelectionRange(input.value.length, input.value.length);
            });
            root.appendChild(input);
        }

        if (labels.exportHeaders && (labels.copy || labels.exportCsv || labels.exportTsv || labels.exportExcel)) {
            const group = document.createElement("div");
            group.className = "calendar-view-export";
            group.setAttribute("role", "group");
            if (labels.export) group.setAttribute("aria-label", labels.export);
            const formats: [ExportFormat | "copy", string | undefined][] = [
                ["copy", labels.copy],
                ["csv", labels.exportCsv],
                ["tsv", labels.exportTsv],
                ["xlsx", labels.exportExcel],
            ];
            for (const [format, text] of formats) {
                if (!text) continue;
                const button = document.createElement("button");
                button.type = "button";
                button.className = "calendar-view-export-button";
                button.setAttribute("data-calendar-export-format", format);
                button.disabled = this.#exportEvents.length === 0;
                button.textContent = text;
                button.addEventListener("click", () => this.#runExport(format));
                group.appendChild(button);
            }
            root.appendChild(group);
        }

        if (view === "agenda") {
            // The agenda is a plain list of days, not a grid: ordinary tab stops, no roving cursor.
            const [agendaStart, agendaEnd] = periodRange("agenda", anchorDate, firstDay);
            const list = document.createElement("ol");
            list.className = "calendar-view-agenda";
            list.setAttribute("aria-label", this.label);
            let count = 0;
            const cap = this.maxEvents;
            for (let d = agendaStart; d <= agendaEnd; d = addDays(d, 1)) {
                const dayEvents = eventMap.get(d) ?? [];
                if (!this.agendaEmptyDays && dayEvents.length === 0) continue;
                count += 1;
                const weekday = weekdayOf(d);
                const isToday = !!this.today && d === this.today;
                const dayRanges = rangesByDay.get(d) ?? NO_RANGES;
                const li = document.createElement("li");
                li.className = "calendar-view-agenda-day";
                li.setAttribute("data-date", d);
                if (isToday) {
                    li.setAttribute("data-today", "");
                    li.setAttribute("aria-current", "date");
                }
                if (this.#weekendDays?.includes(weekday)) li.setAttribute("data-weekend", "");
                if (dayRanges.length) li.setAttribute("data-range", dayRanges.map((r) => r.kind ?? "range").join(" "));
                const time = document.createElement("time");
                time.className = "calendar-view-agenda-date";
                time.setAttribute("datetime", d);
                time.textContent = labels.day?.(d, weekday, false) || d;
                if (!this.agendaDate) {
                    time.setAttribute("data-visually-hidden", "");
                    time.setAttribute("style", "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap");
                }
                li.appendChild(time);
                for (const r of dayRanges) {
                    if (!r.label) continue;
                    const rangeLabel = document.createElement("span");
                    rangeLabel.className = "calendar-view-range-label";
                    rangeLabel.textContent = r.label;
                    li.appendChild(rangeLabel);
                }
                if (dayEvents.length > 0) {
                    li.appendChild(
                        this.renderAgendaDay({
                            date: d,
                            events: dayEvents,
                            visibleEvents: cap == null ? dayEvents : dayEvents.slice(0, Math.max(0, cap)),
                            hiddenCount: cap == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, cap)),
                            isToday,
                            outsidePeriod: false,
                            selected: false,
                            disabled: this.#isDisabledDay(d),
                            inRange: false,
                            ranges: dayRanges,
                            openEvent: (e) => this.#openEvent(e),
                            attachEvent: () => {},
                            fieldText: (e, id) => this.#fieldText(e, id),
                        }),
                    );
                }
                list.appendChild(li);
            }
            root.appendChild(list);
            if (count === 0 && labels.agendaEmpty) {
                const empty = document.createElement("p");
                empty.className = "calendar-view-agenda-empty";
                empty.textContent = labels.agendaEmpty;
                root.appendChild(empty);
            }
            const agendaStatus = document.createElement("div");
            agendaStatus.className = "calendar-view-status";
            agendaStatus.setAttribute("aria-live", "polite");
            agendaStatus.textContent = this.#statusMessage;
            root.appendChild(agendaStatus);
            this.replaceChildren(root);
            return;
        }

        const table = document.createElement("table");
        table.className = "calendar-table calendar-view-table";
        table.setAttribute("role", "grid");
        table.setAttribute("aria-label", this.label);
        table.addEventListener("keydown", (event) => this.#onGridKeydown(event as KeyboardEvent));

        const thead = document.createElement("thead");
        thead.className = "calendar-table-head";
        const headRow = document.createElement("tr");
        headRow.className = "calendar-table-row";
        if (this.showWeekNumbers) {
            const th = document.createElement("th");
            th.className = "calendar-table-th";
            th.setAttribute("scope", "col");
            th.setAttribute("data-week-number-header", "");
            th.textContent = labels.weekNumberHeader ?? "";
            headRow.appendChild(th);
        }
        for (let i = 0; i < (view === "day" ? 1 : 7); i++) {
            const weekday = view === "day" ? weekdayOf(anchorDate) : (firstDay + i) % 7;
            const th = document.createElement("th");
            th.className = "calendar-table-th";
            th.setAttribute("scope", "col");
            if (this.#weekendDays?.includes(weekday)) th.setAttribute("data-weekend", "");
            if (labels.weekdayAbbr) {
                const abbr = document.createElement("abbr");
                abbr.setAttribute("title", labels.weekday?.(weekday) ?? labels.weekdayAbbr(weekday));
                abbr.textContent = labels.weekdayAbbr(weekday);
                th.appendChild(abbr);
            } else if (labels.weekday) {
                th.textContent = labels.weekday(weekday);
            }
            headRow.appendChild(th);
        }
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        tbody.className = "calendar-table-body";
        for (const week of days) {
            const tr = document.createElement("tr");
            tr.className = "calendar-table-row";
            if (this.showWeekNumbers) {
                const weekNo = this.#weekNumberOf(week);
                const th = document.createElement("th");
                th.className = "calendar-table-th";
                th.setAttribute("scope", "row");
                th.setAttribute("data-week-number", String(weekNo));
                const weekName = labels.weekNumber?.(weekNo);
                if (weekName) th.setAttribute("aria-label", weekName);
                th.textContent = String(weekNo);
                tr.appendChild(th);
            }
            for (const d of week) {
                const outside = isOutsidePeriod(view, d, anchorDate);
                const isToday = !!this.today && d === this.today;
                const disabled = this.#isDisabledDay(d);
                const picked = this.selectionMode === "multiple" ? selectedDateSet.has(d) : this.selectedDate === d;
                const range = this.#selectedRange;
                const inRange = !!range && d >= range.start && d <= range.end;
                const dayRanges = rangesByDay.get(d) ?? NO_RANGES;
                const td = document.createElement("td");
                td.className = "calendar-table-td";
                td.setAttribute("role", "gridcell");
                const isCursor = d === cursor;
                td.setAttribute("tabindex", isCursor ? "0" : "-1");
                if (isCursor) td.setAttribute("aria-selected", "true");
                if (isToday) td.setAttribute("aria-current", "date");
                td.setAttribute("data-date", d);
                if (outside) td.setAttribute("data-outside-period", "");
                if (this.#weekendDays?.includes(weekdayOf(d))) td.setAttribute("data-weekend", "");
                if (picked) td.setAttribute("data-selected", "");
                if (inRange) td.setAttribute("data-in-range", "");
                if (range?.start === d) td.setAttribute("data-range-start", "");
                if (range?.end === d) td.setAttribute("data-range-end", "");
                if (dayRanges.length) td.setAttribute("data-range", dayRanges.map((r) => r.kind ?? "range").join(" "));
                if (disabled) {
                    td.setAttribute("data-disabled", "");
                    td.setAttribute("aria-disabled", "true");
                }
                const name = labels.day?.(d, weekdayOf(d), outside);
                if (name) td.setAttribute("aria-label", name);
                const rangeText = dayRanges.map((r) => r.label).filter((l): l is string => !!l).join(", ");
                if (rangeText) {
                    const describedId = `${this.#instanceId}-rg-${d}`;
                    td.setAttribute("aria-describedby", describedId);
                    const hidden = document.createElement("span");
                    hidden.id = describedId;
                    hidden.hidden = true;
                    hidden.textContent = rangeText;
                    td.appendChild(hidden);
                }
                td.addEventListener("click", (event) => {
                    if (event.shiftKey && !disabled) {
                        // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
                        const from = this.selectedDate && !this.#selectedRange ? this.selectedDate : cursor;
                        this.#cursor = d;
                        this.#setRange(from, d, false);
                        this.#confirmRange();
                        return;
                    }
                    this.#cursor = d;
                    this.#rangeAnchor = null;
                    this.#pick(d);
                    this.#render();
                });
                td.addEventListener("dragover", (e) => {
                    if (this.#draggingEventId && this.moveEvents) e.preventDefault();
                });
                td.addEventListener("drop", (e) => {
                    e.preventDefault();
                    const id = this.#draggingEventId ?? (e as DragEvent).dataTransfer?.getData("text/plain");
                    this.#draggingEventId = null;
                    const calendarEvent = this.#events.find((ev) => ev.id === id);
                    if (calendarEvent) this.#moveEventTo(calendarEvent, d);
                });
                const dayEvents = eventMap.get(d) ?? [];
                const cap = this.maxEvents;
                if (this.hideOutsideDays && outside) {
                    tr.appendChild(td);
                    continue;
                }
                td.appendChild(
                    this.renderDay({
                        date: d,
                        events: dayEvents,
                        visibleEvents: cap == null ? dayEvents : dayEvents.slice(0, Math.max(0, cap)),
                        hiddenCount: cap == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, cap)),
                        isToday,
                        outsidePeriod: outside,
                        selected: picked,
                        disabled,
                        inRange,
                        ranges: dayRanges,
                        openEvent: (e) => this.#openEvent(e),
                        attachEvent: (e, el) => this.#attachEvent(e, el),
                        fieldText: (e, id) => this.#fieldText(e, id),
                    }),
                );
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        root.appendChild(table);

        const status = document.createElement("div");
        status.className = "calendar-view-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = this.#statusMessage;
        root.appendChild(status);

        this.replaceChildren(root);

        if (this.#focusPending) {
            this.#focusPending = false;
            this.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')?.focus({ preventScroll: true });
        }
    }
}
