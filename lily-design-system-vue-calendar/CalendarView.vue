<script lang="ts">
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
} from "@lilydesignsystem/vue-date-time-picker";
import type { ExportFormat } from "./export-data";
import type { FieldDef } from "./typed-fields";

/**
 * A typed field an event carries (a room, a status, a cost), shown after the event's title in the agenda and read from
 * `event.values[id]`. A bundle of display, sort and export defaults from the data grid's cell types.
 */
export type CalendarEventField = FieldDef;

/** What `exportHandler` and the `export-file` event receive. Return `false` from `exportHandler` to take over the download. */
export type CalendarExport = { format: ExportFormat; filename: string; eventCount: number; blob: Blob };

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
function nextCalendarViewId(): string {
    uid += 1;
    return `calendar-view-${uid}`;
}

/** What the `field-edit` event carries. */
export type CalendarFieldEdit = { eventId: string; fieldId: string; value: unknown; previous: unknown };

export type CalendarView = "day" | "week" | "four-week" | "month" | "agenda";

/** A marked range (a holiday, a closure, a school term). `label` is text a `day` slot can show. */
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

export type Props = {
    /** Accessible name for the calendar, passed through to CalendarTable. */
    label: string;
    /** ISO date marking "today"; never computed internally (stays SSR-safe). */
    today?: string;
    /** Events to place into day cells. */
    events?: CalendarEvent[];
    /** Hides events for which it returns false (a category, owner or status filter). Combines with the search; both must pass. */
    filter?: (event: CalendarEvent) => boolean;
    /** Orders the events within a day (and so in the agenda). Stable. Without it events keep the order of `events`. */
    eventCompare?: (a: CalendarEvent, b: CalendarEvent) => number;
    /** The text the search looks in. Defaults to the event's title and every field's text. */
    searchText?: (event: CalendarEvent) => string;
    /** Show the agenda on a narrow screen: a viewport narrower than this many pixels (for example `640`) reads as the agenda view, and goes back to `view` when it is wider. A view the user picks with the switcher is respected. Needs `matchMedia`; without it nothing changes. */
    agendaBelow?: number;
    /** Agenda view: show the date beside each day's events (default `true`). `false` hides it visually, keeping it for screen readers (a `<time>` with a `datetime`), for a layout that shows its own date. */
    agendaDate?: boolean;
    /** Agenda view: also list days with no events. Default false (only days with events). */
    agendaEmptyDays?: boolean;
    /** Cap on events shown per day: the `day` slot gets `visibleEvents` and `hiddenCount`. */
    maxEvents?: number;
    /** Month view: leave days outside the shown month empty (the cell keeps `data-outside-period`). */
    hideOutsideDays?: boolean;
    /** Weekday numbers (0 = Sunday … 6 = Saturday) that are the weekend; those cells get `data-weekend`. */
    weekendDays?: number[];
    /** `"multiple"`: Enter/Space or a click toggles a day in `selectedDates` instead of setting `selectedDate`. */
    selectionMode?: "single" | "multiple";
    /** Earliest pickable ISO date. */
    minDate?: string;
    /** Latest pickable ISO date. */
    maxDate?: string;
    /** Extra disabled-day test. Disabled days stay focusable but cannot be picked. */
    isDisabled?: (isoDate: string) => boolean;
    /** Show an ISO week-number column (a row header per week). */
    showWeekNumbers?: boolean;
    /** Marked ranges (holidays, time off, closures): each day inside gets `data-range="{kind}"`. A range's `label` is real text — shown beside the day number (and the agenda date) when there is no `day` slot, and read as the cell's description (`aria-describedby`) — so a marked day is never colour-only. Shading is CSS. */
    ranges?: CalendarRange[];
    /** BCP 47 locale, passed to firstDayOfWeekFor. */
    locale?: string;
    labels?: CalendarViewLabels;
    /** Typed event fields, read from `event.values`. The default agenda shows them after each event's title; a `day` slot gets `fieldText`. Editable types edit in the agenda (click the value; Tab moves to the next) when a `field-edit` listener is attached. */
    eventFields?: CalendarEventField[];
    /** The file name without its extension. Default `"calendar"`. */
    exportFilename?: string;
    /** What an export holds: `"period"` (default) is the events that touch the shown period; `"all"` is every event. */
    exportScope?: "period" | "all";
    /** Called before the download with the finished file. Return `false` to skip the built-in download. */
    exportHandler?: (file: CalendarExport) => boolean | void;
    /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` event fires first. */
    copyHandler?: (copy: { text: string; rowCount: number }) => boolean | void;
    /** Extra CSS class on the root. */
    class?: string;
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
    /** Call from the event's own button/click handler to emit `event-click`. */
    openEvent: (calendarEvent: CalendarEvent) => void;
    /** The formatted text of one event's typed field (empty when the event has no value for it). For a `day` slot that shows fields. */
    fieldText: (calendarEvent: CalendarEvent, fieldId: string) => string;
    /** Bind onto an event's element (`v-bind="eventProps(ev)"`) to make it draggable and keyboard-movable. Empty without an `event-move` listener. */
    eventProps: (calendarEvent: CalendarEvent) => Record<string, unknown>;
};

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate: string, firstDayOfWeek: number): string {
    const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
    return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(view: CalendarView, anchorDate: string, firstDayOfWeek: number): string[][] {
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
export function periodRange(view: CalendarView, anchorDate: string, firstDayOfWeek: number): [string, string] {
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
export function isOutsidePeriod(view: CalendarView, isoDate: string, anchorDate: string): boolean {
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
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import {
    CalendarTable,
    CalendarTableBody,
    CalendarTableHead,
    CalendarTableRow,
    CalendarTableTD,
    CalendarTableTH,
    Mark,
    SearchInput,
} from "@lilydesignsystem/vue-headless";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText } from "./export-data";
import { highlightSegments, matchesSearch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import { civilDateToDate } from "./cell-types";
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
    type ResolvedField,
} from "./typed-fields";

const props = withDefaults(defineProps<Props>(), {
    today: undefined,
    events: () => [],
    filter: undefined,
    eventCompare: undefined,
    searchText: undefined,
    agendaBelow: undefined,
    agendaDate: true,
    copyHandler: undefined,
    maxEvents: undefined,
    agendaEmptyDays: false,
    hideOutsideDays: false,
    weekendDays: undefined,
    selectionMode: "single",
    minDate: undefined,
    maxDate: undefined,
    isDisabled: undefined,
    showWeekNumbers: false,
    ranges: () => [],
    locale: undefined,
    labels: undefined,
    eventFields: undefined,
    exportFilename: "calendar",
    exportScope: "period",
    exportHandler: undefined,
    class: "",
});

// Each is a v-model: bound by the parent when `v-model:x` is used, a local
// ref otherwise. The Svelte canonical's `$bindable` props, in Vue's idiom.
const viewModel = defineModel<CalendarView>("view", { default: "month" });
/** Search (`v-model:search`): shows only the events whose text contains every word of it (any order, ignoring case and diacritics), in every view; the agenda wraps matches in `<mark class="calendar-view-match">`. Exports hold what the search leaves. Escape in the field clears it. */
const search = defineModel<string>("search", { default: "" });
const anchorDate = defineModel<string>("anchorDate", { default: "1970-01-01" });
const selectedDate = defineModel<string | undefined>("selectedDate", { default: undefined });
/** The picked range. Shift+arrows extend it from the cursor; Shift+click picks one; Escape clears it. */
const selectedRange = defineModel<SelectedRange | undefined>("selectedRange", { default: undefined });
/** The picked days in `"multiple"` mode. */
const selectedDates = defineModel<string[]>("selectedDates", { default: () => [] });

const emit = defineEmits<{
    /** The visible period changed: view switch, previous/next/today, or a keyboard re-page. */
    (event: "navigate", view: CalendarView, start: string, end: string): void;
    /** An enabled day cell was activated (Enter/Space, or click). */
    (event: "day-click", isoDate: string): void;
    /** A rendered event was activated, via the `day` slot's `openEvent`. */
    (event: "event-click", calendarEvent: CalendarEvent): void;
    /** A range was confirmed: Enter on an extended range, or Shift+click. */
    (event: "range-select", start: string, end: string): void;
    /** An event was moved to another day (drag-and-drop or Alt+arrow keys). Listening turns the drag-and-drop on. */
    (event: "event-move", calendarEvent: CalendarEvent, toDate: string): void;
    /** An accepted field edit. The consumer updates `events`. A field is editable only when a listener is attached. */
    (event: "field-edit", edit: CalendarFieldEdit): void;
    /** An export file, before it is saved. */
    (event: "export-file", file: CalendarExport): void;
    /** A copy to the clipboard, before it is written. */
    (event: "copy", copy: { text: string; rowCount: number }): void;
}>();

defineSlots<{ day?: (args: DayArgs) => unknown }>();

const baseId = nextCalendarViewId();
const rootEl = ref<HTMLDivElement | null>(null);
const cursor = ref(anchorDate.value);
const statusMessage = ref("");

const firstDayOfWeek = computed(() => firstDayOfWeekFor(props.locale));
// A narrow screen shows the agenda: with `agendaBelow` set, a viewport narrower than that many pixels reads as the agenda view
// (the `view` model is untouched, so a wide screen goes back to it). A view the user picks on purpose is respected.
const narrow = ref(false);
const pickedOnPurpose = ref(false);
const view = computed<CalendarView>(() => (narrow.value && !pickedOnPurpose.value ? "agenda" : viewModel.value));
let narrowQuery: MediaQueryList | null = null;
const updateNarrow = () => {
    narrow.value = !!narrowQuery?.matches;
    if (!narrowQuery?.matches) pickedOnPurpose.value = false;
};
onMounted(() => {
    if (props.agendaBelow === undefined || typeof matchMedia !== "function") return;
    narrowQuery = matchMedia(`(max-width: ${props.agendaBelow - 1}px)`);
    updateNarrow();
    narrowQuery.addEventListener?.("change", updateNarrow);
});
onBeforeUnmount(() => narrowQuery?.removeEventListener?.("change", updateNarrow));

const days = computed(() => periodDays(view.value, anchorDate.value, firstDayOfWeek.value));
const flatDays = computed(() => days.value.flat());
const searching = computed(() => search.value.trim() !== "");
const defaultSearchText = (e: CalendarEvent): string => [eventTitle(e), ...resolvedFields.value.map((f) => eventFieldText(f, e))].join(" ");
/** The events the search leaves (all of them without one), found once per query / event change. */
const events = computed(() => {
    const narrowed =
        searching.value || props.filter
            ? props.events.filter((e) => (!props.filter || props.filter(e)) && (!searching.value || matchesSearch((props.searchText ?? defaultSearchText)(e), search.value)))
            : props.events;
    return props.eventCompare ? [...narrowed].sort(props.eventCompare) : narrowed;
});
const eventMap = computed(() => eventsByDay(events.value));
const eventById = computed(() => new Map(props.events.map((e) => [e.id, e])));
// Announce how many events match after the search changes (not on the first render).
watch(search, () => {
    const message = props.labels?.searchAnnouncement?.(events.value.length, props.events.length);
    if (message) statusMessage.value = message;
});
const selectedDateSet = computed(() => new Set(selectedDates.value));

// Agenda: the days of the shown month that have events (all of them with `agendaEmptyDays`).
const agendaDays = computed(() => {
    if (view.value !== "agenda") return [] as string[];
    const [start, end] = periodRange("agenda", anchorDate.value, firstDayOfWeek.value);
    const out: string[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
        if (props.agendaEmptyDays || (eventMap.value.get(d)?.length ?? 0) > 0) out.push(d);
    }
    return out;
});

// Keep the roving-tabindex cursor inside the visible days whenever the period
// changes from outside (a prop change, not our own keyboard navigation).
watch(
    flatDays,
    (visible) => {
        if (visible.length === 0 || visible.includes(cursor.value)) return;
        cursor.value = visible.includes(anchorDate.value) ? anchorDate.value : visible[0];
    },
    { immediate: true },
);

function disabledDay(isoDate: string): boolean {
    if (props.minDate && isoDate < props.minDate) return true;
    if (props.maxDate && isoDate > props.maxDate) return true;
    return props.isDisabled?.(isoDate) ?? false;
}

// ---------------------------------------------------------------
// Range selection: Shift+arrows extend from an anchor; Enter confirms.
// ---------------------------------------------------------------

let rangeAnchor: string | null = null;
const MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

function setRange(a: string, b: string): void {
    const [start, end] = a <= b ? [a, b] : [b, a];
    selectedRange.value = { start, end };
    const message = props.labels?.rangeAnnouncement?.(start, end);
    if (message) statusMessage.value = message;
}

function confirmRange(): void {
    if (!selectedRange.value) return;
    rangeAnchor = null;
    emit("range-select", selectedRange.value.start, selectedRange.value.end);
}

/** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
function weekNumberOf(row: string[]): number {
    return isoWeek(row.find((d) => weekdayOf(d) === 4) ?? row[0]);
}

function pick(isoDate: string): void {
    if (disabledDay(isoDate)) return;
    if (props.selectionMode === "multiple") {
        selectedDates.value = selectedDates.value.includes(isoDate)
            ? selectedDates.value.filter((d) => d !== isoDate)
            : [...selectedDates.value, isoDate].sort();
    } else {
        selectedDate.value = isoDate;
    }
    emit("day-click", isoDate);
}

function openEvent(calendarEvent: CalendarEvent): void {
    emit("event-click", calendarEvent);
}

// ---------------------------------------------------------------
// Typed fields, inline editing (agenda), export
// ---------------------------------------------------------------

// Whether fields are editable depends on a `field-edit` listener being attached, so it is read from the vnode.
const editable = computed(() => !!instance?.vnode.props?.onFieldEdit);
// Type defaults (format, compare, export value) resolved once per `eventFields` / `locale` change, never per event or keystroke.
const resolvedFields = computed(() => resolveFields(props.eventFields, props.locale));
const isFieldEditable = (f: CalendarEventField) => editable.value && isEditableField(f);
const eventFieldText = (f: ResolvedField, calendarEvent: CalendarEvent): string => fieldTextOf(f, calendarEvent.values);
function fieldText(calendarEvent: CalendarEvent, fieldId: string): string {
    const f = resolvedFields.value.find((x) => x.id === fieldId);
    return f ? eventFieldText(f, calendarEvent) : "";
}
const eventTitle = (calendarEvent: CalendarEvent): string => (typeof calendarEvent.title === "string" ? calendarEvent.title : calendarEvent.id);
const editorValue = (draft: Draft): string => String(draft ?? "");

/** The field being edited, if any: the draft is the editor's text. */
const editing = ref<{ eventId: string; fieldId: string; draft: Draft; invalid?: boolean } | null>(null);
/** Accepted field edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through `field-edit` like any edit. */
let history: EditHistory = EMPTY_HISTORY;

async function startFieldEdit(calendarEvent: CalendarEvent, f: ResolvedField): Promise<void> {
    if (!isFieldEditable(f)) return;
    editing.value = { eventId: calendarEvent.id, fieldId: f.id, draft: draftOf(f, calendarEvent.values) };
    await nextTick();
    const editor = rootEl.value?.querySelector<HTMLInputElement>(".calendar-view-field-editor");
    editor?.focus({ preventScroll: true });
    if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
}

async function focusFieldButton(eventId: string, fieldId: string): Promise<void> {
    await nextTick();
    const li = Array.from(rootEl.value?.querySelectorAll<HTMLElement>("[data-event-key]") ?? []).find((el) => el.dataset.eventKey === eventId);
    const field = Array.from(li?.querySelectorAll<HTMLElement>("[data-field]") ?? []).find((el) => el.dataset.field === fieldId);
    field?.querySelector<HTMLElement>(".calendar-view-field-button")?.focus({ preventScroll: true });
}

/** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
function commitFieldEdit(refocus = true): boolean {
    const current = editing.value;
    if (!current) return true;
    const { eventId, fieldId, draft } = current;
    const calendarEvent = eventById.value.get(eventId);
    const f = resolvedFields.value.find((x) => x.id === fieldId);
    if (!calendarEvent || !f) {
        editing.value = null;
        return true;
    }
    const outcome = evaluateEdit(f, calendarEvent.values, draft);
    if (outcome.invalid) {
        editing.value = { ...current, invalid: true };
        const message = (outcome.message ? props.labels?.editRefused?.(eventTitle(calendarEvent), f.header, outcome.message) : undefined) ?? props.labels?.editInvalid?.(eventTitle(calendarEvent), f.header);
        if (message) statusMessage.value = message;
        return false;
    }
    editing.value = null;
    if (outcome.changed) {
        history = recordEdit(history, { ownerId: eventId, fieldId, value: outcome.value, previous: outcome.previous });
        emit("field-edit", { eventId, fieldId, value: outcome.value, previous: outcome.previous });
        const message = props.labels?.editAnnouncement?.(eventTitle(calendarEvent), f.header, outcome.text);
        if (message) statusMessage.value = message;
    }
    if (refocus) void focusFieldButton(eventId, fieldId);
    return true;
}

/** Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (Ctrl+Y): put an earlier value back, or re-apply it, through `field-edit`. */
function stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(history) : redoEdit(history);
    if (!step.record) return;
    history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    emit("field-edit", { eventId: ownerId, fieldId, value: restored, previous: replaced });
    const calendarEvent = eventById.value.get(ownerId);
    const f = resolvedFields.value.find((x) => x.id === fieldId);
    if (!calendarEvent || !f) return;
    const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(calendarEvent.values ?? {}), [fieldId]: restored }) : String(restored);
    const message = (direction === "undo" ? props.labels?.undoAnnouncement : props.labels?.redoAnnouncement)?.(eventTitle(calendarEvent), f.header, text);
    if (message) statusMessage.value = message;
}

/** Undo / redo from anywhere in the calendar except inside a field editor (which keeps the browser's own undo). */
function onRootKeydown(event: KeyboardEvent): void {
    if (!instance?.vnode.props?.onFieldEdit || (event.target as HTMLElement).closest(".calendar-view-field-editor, input, select, textarea")) return;
    const action = historyKey(event);
    if (!action) return;
    event.preventDefault();
    stepHistory(action);
}

function cancelFieldEdit(): void {
    const current = editing.value;
    if (!current) return;
    editing.value = null;
    void focusFieldButton(current.eventId, current.fieldId);
}

function onFieldEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
        event.preventDefault();
        commitFieldEdit();
    } else if (event.key === "Escape") {
        event.preventDefault();
        cancelFieldEdit();
    } else if (event.key === "Tab" && editing.value) {
        // Tab commits and moves to the event's next (Shift+Tab: previous) editable field; past the last, it moves on.
        const current = editing.value;
        const calendarEvent = eventById.value.get(current.eventId);
        const next = neighbourField(resolvedFields.value.filter(isFieldEditable), current.fieldId, event.shiftKey);
        if (calendarEvent && next) {
            event.preventDefault();
            if (commitFieldEdit(false)) void startFieldEdit(calendarEvent, next);
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

const exportEvents = computed(() => {
    const dated = events.value.filter((e) => eventSpan(e) !== null);
    const kept =
        props.exportScope === "all"
            ? dated
            : dated.filter((e) => {
                  const span = eventSpan(e)!;
                  return span.start <= periodEnd.value && span.end >= periodStart.value;
              });
    return kept.sort((a, b) => eventSpan(a)!.start.localeCompare(eventSpan(b)!.start));
});
const hasExportButtons = computed(() => !!props.labels?.exportHeaders && !!(props.labels.copy || props.labels.exportCsv || props.labels.exportTsv || props.labels.exportExcel));
const exportFieldList = computed(() => exportableFields(resolvedFields.value));

async function finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    emit("copy", copied);
    if (props.copyHandler?.(copied) === false) return;
    const ok = await copyToClipboard(text);
    const message = ok ? props.labels?.copyAnnouncement?.(table.rows.length) : props.labels?.copyFailed;
    if (message) statusMessage.value = message;
}

function runExport(format: ExportFormat | "copy"): void {
    const h = props.labels?.exportHeaders;
    if (!h) return;
    const headers = [h.title, h.start, h.end, ...exportFieldList.value.map((f) => f.header)];
    const body = exportEvents.value.map((calendarEvent) => {
        const span = eventSpan(calendarEvent)!;
        return [
            eventTitle(calendarEvent),
            civilDateToDate(span.start),
            civilDateToDate(span.end),
            ...exportFieldList.value.map((f) => exportFieldCell(f, calendarEvent.values)),
        ];
    });
    if (format === "copy") {
        void finishCopy({ headers, rows: body });
        return;
    }
    const filename = exportFilename(props.exportFilename, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: props.exportFilename });
    const file: CalendarExport = { format, filename, eventCount: body.length, blob };
    emit("export-file", file);
    if (props.exportHandler?.(file) === false) return;
    downloadBlob(blob, filename);
    const message = props.labels?.exportAnnouncement?.(format, body.length, filename);
    if (message) statusMessage.value = message;
}

// ---------------------------------------------------------------
// Event drag-and-drop (supplementary pointer path) + Alt+arrow keys
// ---------------------------------------------------------------

const instance = getCurrentInstance();
const movable = computed(() => !!instance?.vnode.props?.onEventMove);
let draggingEventId: string | null = null;

function eventProps(calendarEvent: CalendarEvent): Record<string, unknown> {
    if (!movable.value) return {};
    return {
        draggable: "true",
        "data-event-id": calendarEvent.id,
        onDragstart: (e: DragEvent) => {
            draggingEventId = calendarEvent.id;
            e.dataTransfer?.setData("text/plain", calendarEvent.id);
        },
    };
}

function moveEventTo(calendarEvent: CalendarEvent, toDate: string): void {
    if (!movable.value || disabledDay(toDate)) return;
    emit("event-move", calendarEvent, toDate);
    const message = props.labels?.eventMoveAnnouncement?.(calendarEvent, toDate);
    if (message) statusMessage.value = message;
}

function onDayDragOver(event: DragEvent): void {
    if (draggingEventId && movable.value) event.preventDefault();
}

function onDayDrop(isoDate: string, event: DragEvent): void {
    event.preventDefault();
    const id = draggingEventId ?? event.dataTransfer?.getData("text/plain");
    draggingEventId = null;
    const calendarEvent = (id ? eventById.value.get(id) : undefined);
    if (calendarEvent) moveEventTo(calendarEvent, isoDate);
}

const periodStart = computed(() => periodRange(view.value, anchorDate.value, firstDayOfWeek.value)[0]);
const periodEnd = computed(() => periodRange(view.value, anchorDate.value, firstDayOfWeek.value)[1]);

// minDate / maxDate bound navigation as well as picking.
const atMinLimit = computed(() => !!props.minDate && periodStart.value <= props.minDate);
const atMaxLimit = computed(() => !!props.maxDate && periodEnd.value >= props.maxDate);
const todayOutOfRange = computed(
    () => props.today == null || (!!props.minDate && props.today < props.minDate) || (!!props.maxDate && props.today > props.maxDate),
);
const clampDate = (isoDate: string): string =>
    props.minDate && isoDate < props.minDate ? props.minDate : props.maxDate && isoDate > props.maxDate ? props.maxDate : isoDate;
function announceLimit(limit: "min" | "max"): void {
    const date = limit === "min" ? props.minDate : props.maxDate;
    const message = date ? props.labels?.rangeLimit?.(limit, date) : undefined;
    if (message) statusMessage.value = message;
}

// The period is announced whenever it changes, whatever changed it: Previous / Next / Today, a view switch, a keyboard move
// across the edge, or the consumer setting `anchorDate` or `view`. The first render says nothing.
let announcedPeriod: string | undefined;
watch(
    () => `${view.value}|${periodStart.value}|${periodEnd.value}`,
    (key) => {
        if (key === announcedPeriod) return;
        announcedPeriod = key;
        if (props.labels?.periodAnnouncement) statusMessage.value = props.labels.periodAnnouncement(view.value, periodStart.value, periodEnd.value);
    },
);
announcedPeriod = `${view.value}|${periodStart.value}|${periodEnd.value}`;

function navigateTo(nextAnchor: string): void {
    anchorDate.value = nextAnchor;
    const [start, end] = periodRange(view.value, anchorDate.value, firstDayOfWeek.value);
    emit("navigate", view.value, start, end);
}

function stepView(delta: 1 | -1): void {
    if (delta < 0 && atMinLimit.value) return announceLimit("min");
    if (delta > 0 && atMaxLimit.value) return announceLimit("max");
    if (view.value === "day") navigateTo(addDays(anchorDate.value, delta));
    else if (view.value === "week") navigateTo(addDays(anchorDate.value, delta * 7));
    else if (view.value === "four-week") navigateTo(addDays(anchorDate.value, delta * 28));
    else navigateTo(addMonths(anchorDate.value, delta));
}

function goToday(): void {
    if (props.today == null || todayOutOfRange.value) return;
    navigateTo(props.today);
}

function setView(next: CalendarView): void {
    viewModel.value = next;
    pickedOnPurpose.value = true;
    const [start, end] = periodRange(view.value, anchorDate.value, firstDayOfWeek.value);
    emit("navigate", view.value, start, end);
}

async function focusCursor(): Promise<void> {
    await nextTick();
    rootEl.value?.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')?.focus({ preventScroll: true });
}

/** Move the cursor, re-paging the visible period when it leaves it. */
function moveCursor(requested: string): void {
    const next = clampDate(requested);
    if (next !== requested) announceLimit(requested < next ? "min" : "max");
    cursor.value = next;
    if (view.value === "month") {
        const cp = parseIsoDate(next);
        const anchor = parseIsoDate(anchorDate.value);
        if (cp && anchor && (cp.year !== anchor.year || cp.month !== anchor.month)) {
            navigateTo(formatIsoDate({ year: cp.year, month: cp.month, day: 1 }));
        }
    } else if (view.value === "day") {
        if (next !== anchorDate.value) navigateTo(next);
    } else {
        const len = view.value === "week" ? 7 : 28;
        let start = weekStart(anchorDate.value, firstDayOfWeek.value);
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
    void focusCursor();
}

function pageCursor(delta: 1 | -1): void {
    if (view.value === "day") moveCursor(addDays(cursor.value, delta));
    else if (view.value === "week") moveCursor(addDays(cursor.value, delta * 7));
    else if (view.value === "four-week") moveCursor(addDays(cursor.value, delta * 28));
    else moveCursor(addMonths(cursor.value, delta));
}

function onGridKeydown(event: KeyboardEvent): void {
    // The horizontal arrows are visual: in a right-to-left layout the next day is on the left, so ArrowLeft goes forward.
    const key = logicalKey(event.key, isRtl(event.target as Element));
    if (movable.value && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
        const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset.date;
        const calendarEvent = (el?.dataset.eventId ? eventById.value.get(el.dataset.eventId) : undefined);
        if (el && fromDate && calendarEvent) {
            event.preventDefault();
            const week = view.value === "day" ? 1 : 7;
            const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[key]!;
            moveEventTo(calendarEvent, addDays(fromDate, delta));
            return;
        }
    }
    const offset = view.value === "day" ? 0 : (weekdayOf(cursor.value) - firstDayOfWeek.value + 7) % 7;
    const extending = event.shiftKey && MOVE_KEYS.has(event.key);
    if (extending && rangeAnchor === null) {
        rangeAnchor = selectedDate.value && !selectedRange.value ? selectedDate.value : cursor.value;
    }
    if (!extending && MOVE_KEYS.has(event.key)) rangeAnchor = null;
    switch (key) {
        case "ArrowLeft":
            event.preventDefault();
            moveCursor(addDays(cursor.value, -1));
            break;
        case "ArrowRight":
            event.preventDefault();
            moveCursor(addDays(cursor.value, 1));
            break;
        case "ArrowUp":
            event.preventDefault();
            moveCursor(addDays(cursor.value, view.value === "day" ? -1 : -7));
            break;
        case "ArrowDown":
            event.preventDefault();
            moveCursor(addDays(cursor.value, view.value === "day" ? 1 : 7));
            break;
        case "Home":
            event.preventDefault();
            moveCursor(addDays(cursor.value, -offset));
            break;
        case "End":
            event.preventDefault();
            moveCursor(addDays(cursor.value, view.value === "day" ? 0 : 6 - offset));
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
            if (rangeAnchor !== null && selectedRange.value) confirmRange();
            else pick(cursor.value);
            break;
        case "Escape":
            if (selectedRange.value || rangeAnchor !== null) {
                event.preventDefault();
                rangeAnchor = null;
                selectedRange.value = undefined;
            }
            break;
        case "t":
        case "T":
            if (props.today == null || event.ctrlKey || event.metaKey || event.altKey) break;
            event.preventDefault();
            navigateTo(props.today);
            moveCursor(props.today);
            break;
    }
    if (extending && rangeAnchor !== null) setRange(rangeAnchor, cursor.value);
}

function onDayCellClick(isoDate: string, event: MouseEvent): void {
    if (event.shiftKey && !disabledDay(isoDate)) {
        // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
        setRange(selectedDate.value && !selectedRange.value ? selectedDate.value : cursor.value, isoDate);
        cursor.value = isoDate;
        confirmRange();
        return;
    }
    cursor.value = isoDate;
    rangeAnchor = null;
    pick(isoDate);
}

const weekdays = computed(() =>
    view.value === "day"
        ? [weekdayOf(anchorDate.value)]
        : Array.from({ length: 7 }, (_, i) => (firstDayOfWeek.value + i) % 7),
);

// The marked ranges per visible day, found once per `ranges` / period change rather than once per cell per render.
const rangesByDay = computed(() => {
    const map = new Map<string, CalendarRange[]>();
    if (props.ranges.length === 0) return map;
    for (const d of view.value === "agenda" ? agendaDays.value : flatDays.value) {
        const hit = props.ranges.filter((r) => d >= r.start && d <= r.end);
        if (hit.length > 0) map.set(d, hit);
    }
    return map;
});
const NO_RANGES: CalendarRange[] = [];
/** The labels of the ranges a day is in, joined for a cell's description; undefined when none has one. */
const rangeLabelsOf = (dayRanges: CalendarRange[]): string | undefined => {
    const text = dayRanges.map((r) => r.label).filter((l): l is string => !!l).join(", ");
    return text === "" ? undefined : text;
};

// A cell's view is built once per day per change; the template reads it many times per cell.
const cellViews = computed(() => {
    const map = new Map<string, ReturnType<typeof buildCellView>>();
    for (const d of view.value === "agenda" ? agendaDays.value : flatDays.value) map.set(d, buildCellView(d));
    return map;
});
const cellView = (d: string) => cellViews.value.get(d) ?? buildCellView(d);

function buildCellView(d: string) {
    const outside = isOutsidePeriod(view.value, d, anchorDate.value);
    return {
        date: d,
        weekday: weekdayOf(d),
        outside,
        isToday: props.today != null && d === props.today,
        events: eventMap.value.get(d) ?? [],
        visibleEvents:
            props.maxEvents == null
                ? (eventMap.value.get(d) ?? [])
                : (eventMap.value.get(d) ?? []).slice(0, Math.max(0, props.maxEvents)),
        hiddenCount:
            props.maxEvents == null ? 0 : Math.max(0, (eventMap.value.get(d) ?? []).length - Math.max(0, props.maxEvents)),
        disabled: disabledDay(d),
        picked: props.selectionMode === "multiple" ? selectedDateSet.value.has(d) : selectedDate.value === d,
        inRange: !!selectedRange.value && d >= selectedRange.value.start && d <= selectedRange.value.end,
        ranges: rangesByDay.value.get(d) ?? NO_RANGES,
        rangeLabels: rangeLabelsOf(rangesByDay.value.get(d) ?? NO_RANGES),
    };
}
</script>

<template>
    <!-- CalendarView.vue -->
    <div ref="rootEl" :class="`calendar-view ${props.class ?? ''}`.trim()" @keydown="onRootKeydown">
        <div v-if="labels?.periodTitle || labels?.dayView || labels?.weekView || labels?.fourWeekView || labels?.monthView || labels?.agendaView" class="calendar-view-toolbar">
            <div class="calendar-view-switcher" role="group">
                <button
                    v-if="labels?.dayView"
                    type="button"
                    class="calendar-view-switcher-button calendar-view-switcher-button-day"
                    :aria-pressed="view === 'day' ? 'true' : 'false'"
                    @click="setView('day')"
                >{{ labels.dayView }}</button>
                <button
                    v-if="labels?.weekView"
                    type="button"
                    class="calendar-view-switcher-button calendar-view-switcher-button-week"
                    :aria-pressed="view === 'week' ? 'true' : 'false'"
                    @click="setView('week')"
                >{{ labels.weekView }}</button>
                <button
                    v-if="labels?.fourWeekView"
                    type="button"
                    class="calendar-view-switcher-button calendar-view-switcher-button-four-week"
                    :aria-pressed="view === 'four-week' ? 'true' : 'false'"
                    @click="setView('four-week')"
                >{{ labels.fourWeekView }}</button>
                <button
                    v-if="labels?.monthView"
                    type="button"
                    class="calendar-view-switcher-button calendar-view-switcher-button-month"
                    :aria-pressed="view === 'month' ? 'true' : 'false'"
                    @click="setView('month')"
                >{{ labels.monthView }}</button>
                <button
                    v-if="labels?.agendaView"
                    type="button"
                    class="calendar-view-switcher-button calendar-view-switcher-button-agenda"
                    :aria-pressed="view === 'agenda' ? 'true' : 'false'"
                    @click="setView('agenda')"
                >{{ labels.agendaView }}</button>
            </div>
            <div class="calendar-view-nav">
                <button
                    type="button"
                    class="calendar-view-previous-button"
                    :aria-label="labels?.previous?.(view)"
                    :aria-disabled="atMinLimit ? 'true' : undefined"
                    @click="stepView(-1)"
                >‹</button>
                <span v-if="labels?.periodTitle" class="calendar-view-title">{{ labels.periodTitle(view, periodStart, periodEnd) }}</span>
                <button
                    v-if="labels?.today"
                    type="button"
                    class="calendar-view-today-button"
                    :disabled="today == null"
                    :aria-disabled="today != null && todayOutOfRange ? 'true' : undefined"
                    @click="goToday"
                >{{ labels.today }}</button>
                <button
                    type="button"
                    class="calendar-view-next-button"
                    :aria-label="labels?.next?.(view)"
                    :aria-disabled="atMaxLimit ? 'true' : undefined"
                    @click="stepView(1)"
                >›</button>
            </div>
        </div>

        <SearchInput
            v-if="labels?.search"
            v-model="search"
            class="calendar-view-search"
            :label="labels.search"
            @keydown="(e: KeyboardEvent) => { if (e.key === 'Escape' && search !== '') { e.preventDefault(); search = ''; } }"
        />

        <div v-if="hasExportButtons" class="calendar-view-export" role="group" :aria-label="labels?.export">
            <button v-if="labels?.copy" type="button" class="calendar-view-export-button" data-calendar-export-format="copy" :disabled="exportEvents.length === 0" @click="runExport('copy')">{{ labels.copy }}</button>
            <button v-if="labels?.exportCsv" type="button" class="calendar-view-export-button" data-calendar-export-format="csv" :disabled="exportEvents.length === 0" @click="runExport('csv')">{{ labels.exportCsv }}</button>
            <button v-if="labels?.exportTsv" type="button" class="calendar-view-export-button" data-calendar-export-format="tsv" :disabled="exportEvents.length === 0" @click="runExport('tsv')">{{ labels.exportTsv }}</button>
            <button v-if="labels?.exportExcel" type="button" class="calendar-view-export-button" data-calendar-export-format="xlsx" :disabled="exportEvents.length === 0" @click="runExport('xlsx')">{{ labels.exportExcel }}</button>
        </div>

        <template v-if="view === 'agenda'">
            <!-- The agenda is a plain list of days, not a grid: ordinary tab stops, no roving cursor. -->
            <ol class="calendar-view-agenda" :aria-label="label">
                <li
                    v-for="d in agendaDays"
                    :key="d"
                    class="calendar-view-agenda-day"
                    :data-date="d"
                    :data-today="cellView(d).isToday ? '' : undefined"
                    :data-weekend="weekendDays?.includes(cellView(d).weekday) ? '' : undefined"
                    :data-range="cellView(d).ranges.length ? cellView(d).ranges.map((r) => r.kind ?? 'range').join(' ') : undefined"
                    :aria-current="cellView(d).isToday ? 'date' : undefined"
                >
                    <time
                        class="calendar-view-agenda-date"
                        :datetime="d"
                        :data-visually-hidden="agendaDate ? undefined : ''"
                        :style="agendaDate ? undefined : 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap'"
                    >{{ labels?.day?.(d, cellView(d).weekday, false) ?? d }}</time>
                    <template v-for="range in cellView(d).ranges" :key="range.start + range.end + (range.kind ?? '') + (range.label ?? '')">
                        <span v-if="range.label" class="calendar-view-range-label">{{ range.label }}</span>
                    </template>
                    <slot
                        name="day"
                        :date="d"
                        :events="cellView(d).events"
                        :visible-events="cellView(d).visibleEvents"
                        :hidden-count="cellView(d).hiddenCount"
                        :is-today="cellView(d).isToday"
                        :outside-period="false"
                        :selected="false"
                        :disabled="cellView(d).disabled"
                        :in-range="false"
                        :ranges="cellView(d).ranges"
                        :open-event="openEvent"
                        :field-text="fieldText"
                        :event-props="eventProps"
                    >
                        <ul v-if="cellView(d).events.length > 0" class="calendar-view-agenda-events">
                            <li v-for="calendarEvent in cellView(d).events" :key="calendarEvent.id" :data-event-key="calendarEvent.id">
                                <button type="button" class="calendar-view-event" @click="openEvent(calendarEvent)"><template v-if="searching"><template v-for="(part, i) in highlightSegments(eventTitle(calendarEvent), search)" :key="i"><Mark v-if="part.match" class="calendar-view-match">{{ part.text }}</Mark><template v-else>{{ part.text }}</template></template></template><template v-else>{{ eventTitle(calendarEvent) }}</template></button>
                                <span v-if="resolvedFields.length > 0" class="calendar-view-event-fields">
                                    <template v-for="f in resolvedFields" :key="f.id">
                                        <span
                                            v-if="editing && editing.eventId === calendarEvent.id && editing.fieldId === f.id"
                                            class="calendar-view-event-field"
                                            :data-field="f.id"
                                            data-editing=""
                                        >
                                            <span class="calendar-view-event-field-name" :id="`${baseId}-fn-${calendarEvent.id}-${f.id}`">{{ f.header }}</span>{{ " " }}
                                            <select
                                                v-if="editorKind(f) === 'select' || editorKind(f) === 'radio'"
                                                class="calendar-view-field-editor"
                                                :aria-label="f.editLabel ?? f.header"
                                                :aria-invalid="editing.invalid ? 'true' : undefined"
                                                :value="editorValue(editing.draft)"
                                                @change="(e) => { editing!.draft = (e.target as HTMLSelectElement).value; commitFieldEdit(); }"
                                                @keydown="onFieldEditorKeydown"
                                                @blur="commitFieldEdit(false)"
                                            >
                                                <option value=""></option>
                                                <option v-for="option in f.options ?? []" :key="option.id" :value="option.id" :disabled="option.disabled">{{ option.label }}</option>
                                            </select>
                                            <input
                                                v-else
                                                class="calendar-view-field-editor"
                                                :aria-label="f.editLabel ?? f.header"
                                                :aria-invalid="editing.invalid ? 'true' : undefined"
                                                :type="editorKind(f) === 'number' ? 'number' : editorKind(f) === 'date' ? 'date' : editorKind(f) === 'time' ? 'time' : 'text'"
                                                :inputmode="editorKind(f) === 'number' ? 'decimal' : undefined"
                                                :value="editorValue(editing.draft)"
                                                @input="(e) => { editing!.draft = (e.target as HTMLInputElement).value; editing!.invalid = false; }"
                                                @keydown="onFieldEditorKeydown"
                                                @blur="commitFieldEdit(false)"
                                            />
                                        </span>
                                        <span
                                            v-else-if="eventFieldText(f, calendarEvent) !== '' || isFieldEditable(f)"
                                            class="calendar-view-event-field"
                                            :data-field="f.id"
                                            :data-type="f.type ?? 'text'"
                                        >
                                            <span class="calendar-view-event-field-name" :id="`${baseId}-fn-${calendarEvent.id}-${f.id}`">{{ f.header }}</span>{{ " " }}
                                            <button
                                                v-if="isFieldEditable(f)"
                                                type="button"
                                                class="calendar-view-field-button"
                                                :id="`${baseId}-fv-${calendarEvent.id}-${f.id}`"
                                                :aria-labelledby="`${baseId}-fn-${calendarEvent.id}-${f.id} ${baseId}-fv-${calendarEvent.id}-${f.id}`"
                                                @click="startFieldEdit(calendarEvent, f)"
                                            >{{ eventFieldText(f, calendarEvent) }}</button>
                                            <span v-else class="calendar-view-event-field-value">{{ eventFieldText(f, calendarEvent) }}</span>
                                        </span>
                                    </template>
                                </span>
                            </li>
                        </ul>
                    </slot>
                </li>
            </ol>
            <p v-if="agendaDays.length === 0 && labels?.agendaEmpty" class="calendar-view-agenda-empty">{{ labels.agendaEmpty }}</p>
        </template>
        <CalendarTable v-else :label="label" class="calendar-view-table" @keydown="onGridKeydown">
            <CalendarTableHead>
                <CalendarTableRow>
                    <CalendarTableTH v-if="showWeekNumbers" scope="col" data-week-number-header>{{ labels?.weekNumberHeader ?? "" }}</CalendarTableTH>
                    <CalendarTableTH v-for="(weekday, i) in weekdays" :key="i" scope="col" :data-weekend="weekendDays?.includes(weekday) ? '' : undefined">
                        <abbr
                            v-if="labels?.weekdayAbbr"
                            :title="labels.weekday?.(weekday) ?? labels.weekdayAbbr(weekday)"
                            >{{ labels.weekdayAbbr(weekday) }}</abbr
                        >
                        <template v-else-if="labels?.weekday">{{ labels.weekday(weekday) }}</template>
                    </CalendarTableTH>
                </CalendarTableRow>
            </CalendarTableHead>
            <CalendarTableBody>
                <CalendarTableRow v-for="(week, rowIndex) in days" :key="rowIndex">
                    <CalendarTableTH
                        v-if="showWeekNumbers"
                        scope="row"
                        :data-week-number="weekNumberOf(week)"
                        :aria-label="labels?.weekNumber?.(weekNumberOf(week))"
                    >{{ weekNumberOf(week) }}</CalendarTableTH>
                    <CalendarTableTD
                        v-for="d in week"
                        :key="d"
                        :selected="d === cursor"
                        :today="cellView(d).isToday"
                        :data-date="d"
                        :data-outside-period="cellView(d).outside ? '' : undefined"
                        :data-weekend="weekendDays?.includes(cellView(d).weekday) ? '' : undefined"
                        :data-selected="cellView(d).picked ? '' : undefined"
                        :data-disabled="cellView(d).disabled ? '' : undefined"
                        :data-in-range="cellView(d).inRange ? '' : undefined"
                        :data-range-start="selectedRange?.start === d ? '' : undefined"
                        :data-range-end="selectedRange?.end === d ? '' : undefined"
                        :data-range="cellView(d).ranges.length ? cellView(d).ranges.map((r) => r.kind ?? 'range').join(' ') : undefined"
                        :aria-disabled="cellView(d).disabled ? 'true' : undefined"
                        :aria-label="labels?.day?.(d, cellView(d).weekday, cellView(d).outside)"
                        :aria-describedby="cellView(d).rangeLabels ? `${baseId}-rg-${d}` : undefined"
                        @click="(e: MouseEvent) => onDayCellClick(d, e)"
                        @dragover="onDayDragOver"
                        @drop="(e: DragEvent) => onDayDrop(d, e)"
                    >
                        <span v-if="cellView(d).rangeLabels" :id="`${baseId}-rg-${d}`" hidden>{{ cellView(d).rangeLabels }}</span>
                        <template v-if="hideOutsideDays && cellView(d).outside"></template>
                        <slot v-else
                            name="day"
                            :date="d"
                            :events="cellView(d).events"
                            :visible-events="cellView(d).visibleEvents"
                            :hidden-count="cellView(d).hiddenCount"
                            :is-today="cellView(d).isToday"
                            :outside-period="cellView(d).outside"
                            :selected="cellView(d).picked"
                            :disabled="cellView(d).disabled"
                            :in-range="cellView(d).inRange"
                            :ranges="cellView(d).ranges"
                            :open-event="openEvent"
                            :field-text="fieldText"
                            :event-props="eventProps"
                        >{{ parseIsoDate(d)?.day }}<template v-for="range in cellView(d).ranges" :key="range.start + range.end + (range.kind ?? '') + (range.label ?? '')"><span v-if="range.label" class="calendar-view-range-label">{{ range.label }}</span></template></slot>
                    </CalendarTableTD>
                </CalendarTableRow>
            </CalendarTableBody>
        </CalendarTable>

        <div class="calendar-view-status" aria-live="polite">{{ statusMessage }}</div>
    </div>
</template>
