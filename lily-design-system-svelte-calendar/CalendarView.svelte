<script lang="ts" module>
    import {
        CalendarTable,
        CalendarTableBody,
        CalendarTableHead,
        CalendarTableRow,
        CalendarTableTD,
        CalendarTableTH,
    } from "@lilydesignsystem/svelte-headless";
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
    } from "@lilydesignsystem/svelte-date-time-picker";
    import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data";
    import { civilDateToDate } from "./cell-types";
    import {
        draftOf as fieldDraft,
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

    /** A marked range (a holiday, a closure, a school term). `label` is text a `day` snippet can render. */
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
     * Every field is optional, but its presence gates the control it
     * names — no baked-in English fallback, matching every other
     * helper's label-gating convention. See spec/index.md §5.
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
        /** Full accessible name for one day cell, e.g. "11, Tuesday, 6 January 2026". */
        day?: (isoDate: string, weekday: number, outsidePeriod: boolean) => string;
        /** Visible text for the week-number column header (e.g. "Wk"). */
        weekNumberHeader?: string;
        /** Accessible name for a week-number cell (e.g. "Week 3"). Without it the bare number is the name. */
        weekNumber?: (week: number) => string;
        /** Announced as a range is extended with Shift+arrows or confirmed. */
        rangeAnnouncement?: (start: string, end: string) => string;
        /** Visible title of the shown period (e.g. "January 2026"), rendered between the previous and next buttons. Gates the title. */
        periodTitle?: (view: CalendarView, start: string, end: string) => string;
        /** Announced after an event is moved to another day. */
        eventMoveAnnouncement?: (calendarEvent: CalendarEvent, toDate: string) => string;
        /** Accessible name of the export button group. Gates the group (with at least one of the three buttons). */
        export?: string;
        /** Visible text of the CSV, TSV and Excel export buttons. Each gates its button. */
        exportCsv?: string;
        exportTsv?: string;
        exportExcel?: string;
        /** Announced after an export: (format, how many events, file name). */
        exportAnnouncement?: (format: ExportFormat, eventCount: number, filename: string) => string;
        /** Headers of the export's own columns. An export needs `exportHeaders`; there is no English default. */
        exportHeaders?: { title: string; start: string; end: string };
        /** Announced after a field edit: (event title, field header, the new text). */
        editAnnouncement?: (eventTitle: string, fieldHeader: string, text: string) => string;
        /** Announced when an edit is refused as invalid for the field's type: (event title, field header). */
        editInvalid?: (eventTitle: string, fieldHeader: string) => string;
    };

    export type Props = {
        /** Accessible name for the calendar, passed through to CalendarTable. */
        label: string;
        /** Which period is shown. */
        view: CalendarView;
        /** ISO date the visible period is computed around. */
        anchorDate: string;
        /** Events to place into day cells. */
        events?: CalendarEvent[];
        /** Agenda view: also list days with no events. Default false (only days with events). */
        agendaEmptyDays?: boolean;
        /** Cap on events shown per day: the day snippet gets `visibleEvents` (the first `maxEvents`) and `hiddenCount` for a "+N more" control. */
        maxEvents?: number;
        /** Month view: leave days outside the shown month empty (no number, no events; the cell keeps `data-outside-period`). */
        hideOutsideDays?: boolean;
        /** Weekday numbers (0 = Sunday … 6 = Saturday) that are the weekend; those cells get `data-weekend`. Lily assumes none, since weekends differ by country. */
        weekendDays?: number[];
        /** Called when an event is moved to another day, by pointer drag-and-drop or Alt+arrow keys (a day, or a week with Up/Down) on a focused event element. The consumer updates `events`. Setting it turns the drag-and-drop on. */
        onEventMove?: (calendarEvent: CalendarEvent, toDate: string) => void;
        /** ISO date marking "today"; never computed internally (stays SSR-safe). */
        today?: string;
        /** BCP 47 locale, passed to firstDayOfWeekFor. */
        locale?: string;
        labels?: CalendarViewLabels;
        /** Fired whenever the visible period changes: view switch, previous/next/today, or a keyboard re-page. */
        onNavigate?: (view: CalendarView, start: string, end: string) => void;
        /** ISO date the user has picked (Enter/Space or click). Bindable; distinct from the keyboard cursor. */
        selectedDate?: string;
        /** `"multiple"`: Enter/Space or a click toggles a day in `selectedDates` instead of setting `selectedDate`. Default `"single"`. */
        selectionMode?: "single" | "multiple";
        /** The picked days in `"multiple"` mode. Two-way bindable. */
        selectedDates?: string[];
        /** Earliest pickable ISO date; earlier days get `aria-disabled`. */
        minDate?: string;
        /** Latest pickable ISO date; later days get `aria-disabled`. */
        maxDate?: string;
        /** Extra disabled-day test (holidays, closed days). Disabled days stay focusable but cannot be picked. */
        isDisabled?: (isoDate: string) => boolean;
        /** Show an ISO week-number column (a row header per week). */
        showWeekNumbers?: boolean;
        /** Marked ranges (holidays, closures): each day inside gets `data-range="{kind}"`. */
        ranges?: CalendarRange[];
        /** The picked range, bindable. Shift+arrows extend it from the cursor; Shift+click picks one; Escape clears it. */
        selectedRange?: SelectedRange;
        /** Fired when a range is confirmed: Enter on an extended range, or Shift+click. */
        onRangeSelect?: (start: string, end: string) => void;
        /** Fired when an enabled day cell is activated (Enter/Space, or click). */
        onDayClick?: (isoDate: string) => void;
        /** Fired when a rendered event is activated. Consumer wires this to the `day` snippet's own click handler. */
        onEventClick?: (calendarEvent: CalendarEvent) => void;
        /** Typed event fields, read from `event.values`. The default agenda shows them after each event's title; a `day` snippet gets `fieldText`. Editable types edit in the agenda (click the value; Tab moves to the next). */
        eventFields?: CalendarEventField[];
        /** Called with each accepted field edit. The consumer updates `events`. A field is editable only when this is set. */
        onFieldEdit?: (edit: CalendarFieldEdit) => void;
        /** Base of an export's file name (`.csv`, `.tsv` or `.xlsx` is added). Default `"calendar"`. */
        exportFilename?: string;
        /** What an export holds: `"period"` (default) is the events that touch the shown period; `"all"` is every event. */
        exportScope?: "period" | "all";
        /** Called before the download with the finished file. Return `false` to skip the built-in download. */
        onExport?: (info: CalendarExport) => boolean | void;
        [key: string]: unknown;
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
        /** The formatted text of one event's typed field (empty when the event has no value for it). For a `day` snippet that shows fields. */
        fieldText: (calendarEvent: CalendarEvent, fieldId: string) => string;
        /** Spread onto an event's element to make it draggable and keyboard-movable: `{...eventProps(ev)}`. Empty without `onEventMove`. */
        eventProps: (calendarEvent: CalendarEvent) => Record<string, unknown>;
    };

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextCalendarViewId(): string {
        uid += 1;
        return `calendar-view-${uid}`;
    }

    /** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
    export function weekStart(isoDate: string, firstDayOfWeek: number): string {
        const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
        return addDays(isoDate, -offset);
    }

    /**
     * The visible days for `view`, anchored around `anchorDate`, as rows of 7.
     * Week: 1 row. Four-week: 4 rows. Month: the fixed 6-row `monthMatrix`.
     */
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

    /** The inclusive [start, end] ISO range `view` covers, anchored around `anchorDate`. */
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

    /** Whether `isoDate` falls outside `anchorDate`'s own calendar month. Always false for week/four-week (no padding). */
    export function isOutsidePeriod(view: CalendarView, isoDate: string, anchorDate: string): boolean {
        if (view !== "month") return false;
        const day = parseIsoDate(isoDate);
        const anchor = parseIsoDate(anchorDate);
        if (!day || !anchor) return false;
        return day.year !== anchor.year || day.month !== anchor.month;
    }

    /** Map each event to every ISO date it covers (its own `date`, or every day in `[start, end]`). */
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

<script lang="ts">
    import { tick, type Snippet } from "svelte";

    let {
        class: className = "",
        label,
        view = $bindable("month"),
        anchorDate = $bindable(),
        events = [],
        maxEvents = undefined,
        agendaEmptyDays = false,
        hideOutsideDays = false,
        weekendDays = undefined,
        onEventMove = undefined,
        today = undefined,
        selectedDate = $bindable(undefined),
        selectionMode = "single",
        selectedDates = $bindable([]),
        minDate = undefined,
        maxDate = undefined,
        isDisabled = undefined,
        showWeekNumbers = false,
        ranges = [],
        selectedRange = $bindable(undefined),
        onRangeSelect = undefined,
        locale = undefined,
        labels = undefined,
        onNavigate = undefined,
        onDayClick = undefined,
        onEventClick = undefined,
        eventFields = undefined,
        onFieldEdit = undefined,
        exportFilename: exportBase = "calendar",
        exportScope = "period",
        onExport = undefined,
        day,
        ...restProps
    }: Props & { day?: Snippet<[DayArgs]> } = $props();

    const baseId = nextCalendarViewId();
    let rootEl: HTMLDivElement | undefined = $state();
    let cursor = $state(anchorDate);
    let statusMessage = $state("");

    const firstDayOfWeek = $derived(firstDayOfWeekFor(locale));
    const days = $derived.by(() => periodDays(view, anchorDate, firstDayOfWeek));
    const flatDays = $derived(days.flat());
    const eventMap = $derived.by(() => eventsByDay(events));

    // Agenda: the days of the shown month that have events (all of them with `agendaEmptyDays`).
    const agendaDays = $derived.by(() => {
        if (view !== "agenda") return [] as string[];
        const [start, end] = periodRange("agenda", anchorDate, firstDayOfWeek);
        const out: string[] = [];
        for (let d = start; d <= end; d = addDays(d, 1)) {
            if (agendaEmptyDays || (eventMap.get(d)?.length ?? 0) > 0) out.push(d);
        }
        return out;
    });

    // Keep the roving-tabindex cursor inside the currently visible days
    // whenever the period changes from outside (a prop change, not our
    // own keyboard navigation, which already keeps `cursor` in sync).
    $effect(() => {
        if (flatDays.length === 0) return;
        if (flatDays.includes(cursor)) return;
        cursor = flatDays.includes(anchorDate) ? anchorDate : flatDays[0];
    });

    function disabledDay(isoDate: string): boolean {
        if (minDate && isoDate < minDate) return true;
        if (maxDate && isoDate > maxDate) return true;
        return isDisabled?.(isoDate) ?? false;
    }

    // ---------------------------------------------------------------
    // Range selection: Shift+arrows extend from an anchor; Enter confirms.
    // ---------------------------------------------------------------

    let rangeAnchor: string | null = null;
    const MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

    function setRange(a: string, b: string): void {
        const [start, end] = a <= b ? [a, b] : [b, a];
        selectedRange = { start, end };
        const message = labels?.rangeAnnouncement?.(start, end);
        if (message) statusMessage = message;
    }

    function confirmRange(): void {
        if (!selectedRange) return;
        rangeAnchor = null;
        onRangeSelect?.(selectedRange.start, selectedRange.end);
    }

    const inSelectedRange = (isoDate: string) =>
        !!selectedRange && isoDate >= selectedRange.start && isoDate <= selectedRange.end;

    // The marked ranges per visible day, found once per `ranges` / period change rather than once per cell per render.
    const rangesByDay = $derived.by(() => {
        const map = new Map<string, CalendarRange[]>();
        if (ranges.length === 0) return map;
        const shown = view === "agenda" ? agendaDays : flatDays;
        for (const d of shown) {
            const hit = ranges.filter((r) => d >= r.start && d <= r.end);
            if (hit.length > 0) map.set(d, hit);
        }
        return map;
    });
    const NO_RANGES: CalendarRange[] = [];
    const rangesFor = (isoDate: string) => rangesByDay.get(isoDate) ?? NO_RANGES;
    const selectedDateSet = $derived(new Set(selectedDates));
    const eventById = $derived(new Map(events.map((e) => [e.id, e])));

    /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
    function weekNumberOf(row: string[]): number {
        const thursday = row.find((d) => weekdayOf(d) === 4) ?? row[0];
        return isoWeek(thursday);
    }

    function pick(isoDate: string): void {
        if (disabledDay(isoDate)) return;
        if (selectionMode === "multiple") {
            selectedDates = selectedDates.includes(isoDate) ? selectedDates.filter((d) => d !== isoDate) : [...selectedDates, isoDate].sort();
        } else {
            selectedDate = isoDate;
        }
        onDayClick?.(isoDate);
    }

    // ---------------------------------------------------------------
    // Typed fields, inline editing (agenda), export
    // ---------------------------------------------------------------

    // Type defaults (format, compare, export value) resolved once per `eventFields` / `locale` change, never per event or keystroke.
    const resolvedFields = $derived(resolveFields(eventFields, locale));
    const isFieldEditable = (f: CalendarEventField) => !!onFieldEdit && isEditableField(f);
    const eventFieldText = (f: ResolvedField, calendarEvent: CalendarEvent): string => fieldTextOf(f, calendarEvent.values);
    function fieldText(calendarEvent: CalendarEvent, fieldId: string): string {
        const f = resolvedFields.find((x) => x.id === fieldId);
        return f ? eventFieldText(f, calendarEvent) : "";
    }
    const eventTitle = (calendarEvent: CalendarEvent): string => (typeof calendarEvent.title === "string" ? calendarEvent.title : calendarEvent.id);

    /** The field being edited, if any: the draft is the editor's text. */
    let editing = $state<{ eventId: string; fieldId: string; draft: Draft } | null>(null);
    let committing = false;

    async function startFieldEdit(calendarEvent: CalendarEvent, f: ResolvedField): Promise<void> {
        if (!isFieldEditable(f)) return;
        editing = { eventId: calendarEvent.id, fieldId: f.id, draft: fieldDraft(f, calendarEvent.values) };
        await tick();
        const editor = rootEl?.querySelector<HTMLInputElement>(".calendar-view-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    }

    /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
    function commitFieldEdit(refocus = true): boolean {
        if (!editing || committing) return true;
        const { eventId, fieldId, draft } = editing;
        const calendarEvent = eventById.get(eventId);
        const f = resolvedFields.find((x) => x.id === fieldId);
        if (!calendarEvent || !f) {
            editing = null;
            return true;
        }
        const outcome = evaluateEdit(f, calendarEvent.values, draft);
        if (outcome.invalid) {
            const message = labels?.editInvalid?.(eventTitle(calendarEvent), f.header);
            if (message) statusMessage = message;
            return false;
        }
        committing = true;
        editing = null;
        if (outcome.changed) {
            onFieldEdit?.({ eventId, fieldId, value: outcome.value, previous: outcome.previous });
            const message = labels?.editAnnouncement?.(eventTitle(calendarEvent), f.header, outcome.text);
            if (message) statusMessage = message;
        }
        committing = false;
        if (refocus) void focusFieldButton(eventId, fieldId);
        return true;
    }

    function cancelFieldEdit(): void {
        if (!editing) return;
        const { eventId, fieldId } = editing;
        editing = null;
        void focusFieldButton(eventId, fieldId);
    }

    async function focusFieldButton(eventId: string, fieldId: string): Promise<void> {
        await tick();
        rootEl?.querySelector<HTMLElement>(`[data-event-key="${CSS.escape(eventId)}"] [data-field="${CSS.escape(fieldId)}"] .calendar-view-field-button`)?.focus({ preventScroll: true });
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
        } else if (event.key === "Tab" && editing) {
            // Tab commits and moves to the event's next (Shift+Tab: previous) editable field; past the last, it moves on.
            const calendarEvent = eventById.get(editing.eventId);
            const next = neighbourField(resolvedFields.filter(isFieldEditable), editing.fieldId, event.shiftKey);
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
        calendarEvent.date ? { start: calendarEvent.date, end: calendarEvent.date } : calendarEvent.start && calendarEvent.end ? { start: calendarEvent.start, end: calendarEvent.end } : null;

    const exportEvents = $derived.by(() => {
        const dated = events.filter((e) => eventSpan(e) !== null);
        const kept = exportScope === "all" ? dated : dated.filter((e) => { const span = eventSpan(e)!; return span.start <= periodEnd && span.end >= periodStart; });
        return kept.sort((a, b) => eventSpan(a)!.start.localeCompare(eventSpan(b)!.start));
    });
    const hasExportButtons = $derived(!!labels?.exportHeaders && !!(labels.exportCsv || labels.exportTsv || labels.exportExcel));
    const exportFieldList = $derived(exportableFields(resolvedFields));

    function runExport(format: ExportFormat): void {
        const h = labels?.exportHeaders;
        if (!h) return;
        const headers = [h.title, h.start, h.end, ...exportFieldList.map((f) => f.header)];
        const body = exportEvents.map((calendarEvent) => {
            const span = eventSpan(calendarEvent)!;
            return [eventTitle(calendarEvent), civilDateToDate(span.start), civilDateToDate(span.end), ...exportFieldList.map((f) => exportFieldCell(f, calendarEvent.values))];
        });
        const filename = exportFilename(exportBase, format);
        const blob = exportBlob({ headers, rows: body }, format, { sheetName: exportBase });
        if (onExport?.({ format, filename, eventCount: body.length, blob }) === false) return;
        downloadBlob(blob, filename);
        const message = labels?.exportAnnouncement?.(format, body.length, filename);
        if (message) statusMessage = message;
    }

    function openEvent(calendarEvent: CalendarEvent): void {
        onEventClick?.(calendarEvent);
    }

    // ---------------------------------------------------------------
    // Event drag-and-drop (supplementary pointer path) + Alt+arrow keys
    // ---------------------------------------------------------------

    let draggingEventId: string | null = null;

    function eventProps(calendarEvent: CalendarEvent): Record<string, unknown> {
        if (!onEventMove) return {};
        return {
            draggable: "true",
            "data-event-id": calendarEvent.id,
            ondragstart: (e: DragEvent) => {
                draggingEventId = calendarEvent.id;
                e.dataTransfer?.setData("text/plain", calendarEvent.id);
            },
        };
    }

    function moveEventTo(calendarEvent: CalendarEvent, toDate: string): void {
        if (!onEventMove || disabledDay(toDate)) return;
        onEventMove(calendarEvent, toDate);
        const message = labels?.eventMoveAnnouncement?.(calendarEvent, toDate);
        if (message) statusMessage = message;
    }

    function onDayDragOver(event: DragEvent): void {
        if (draggingEventId && onEventMove) event.preventDefault();
    }

    function onDayDrop(isoDate: string, event: DragEvent): void {
        event.preventDefault();
        const id = draggingEventId ?? event.dataTransfer?.getData("text/plain");
        draggingEventId = null;
        const calendarEvent = id ? eventById.get(id) : undefined;
        if (calendarEvent) moveEventTo(calendarEvent, isoDate);
    }

    const periodStart = $derived(periodRange(view, anchorDate, firstDayOfWeek)[0]);
    const periodEnd = $derived(periodRange(view, anchorDate, firstDayOfWeek)[1]);

    function announce(): void {
        if (!labels?.periodAnnouncement) return;
        const [start, end] = periodRange(view, anchorDate, firstDayOfWeek);
        statusMessage = labels.periodAnnouncement(view, start, end);
    }

    function navigateTo(nextAnchor: string): void {
        anchorDate = nextAnchor;
        const [start, end] = periodRange(view, anchorDate, firstDayOfWeek);
        onNavigate?.(view, start, end);
        announce();
    }

    function stepView(delta: 1 | -1): void {
        if (view === "day") navigateTo(addDays(anchorDate, delta));
        else if (view === "week") navigateTo(addDays(anchorDate, delta * 7));
        else if (view === "four-week") navigateTo(addDays(anchorDate, delta * 28));
        else navigateTo(addMonths(anchorDate, delta));
    }

    function goToday(): void {
        if (today == null) return;
        navigateTo(today);
    }

    function setView(next: CalendarView): void {
        view = next;
        const [start, end] = periodRange(view, anchorDate, firstDayOfWeek);
        onNavigate?.(view, start, end);
        announce();
    }

    function focusCursor(): void {
        queueMicrotask(() => {
            rootEl?.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')?.focus({ preventScroll: true });
        });
    }

    /**
     * Move the cursor, re-paging the visible period when the new cursor
     * date falls outside it — mirrors `date-time-picker`'s own
     * `moveCursor`/`shiftMonth`/`shiftDays` re-paging for its calendar
     * dialog (spec/index.md §6.3).
     */
    function moveCursor(next: string): void {
        cursor = next;
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
        focusCursor();
    }

    function pageCursor(delta: 1 | -1): void {
        if (view === "day") moveCursor(addDays(cursor, delta));
        else if (view === "week") moveCursor(addDays(cursor, delta * 7));
        else if (view === "four-week") moveCursor(addDays(cursor, delta * 28));
        else moveCursor(addMonths(cursor, delta));
    }

    function onGridKeydown(event: KeyboardEvent): void {
        if (onEventMove && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
            const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
            const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset.date;
            const calendarEvent = el?.dataset.eventId ? eventById.get(el.dataset.eventId) : undefined;
            if (el && fromDate && calendarEvent) {
                event.preventDefault();
                const week = view === "day" ? 1 : 7;
                const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[event.key as string]!;
                moveEventTo(calendarEvent, addDays(fromDate, delta));
                return;
            }
        }
        const extending = event.shiftKey && MOVE_KEYS.has(event.key);
        if (extending && rangeAnchor === null) rangeAnchor = selectedDate && !selectedRange ? selectedDate : cursor;
        if (!extending && MOVE_KEYS.has(event.key)) rangeAnchor = null;
        switch (event.key) {
            case "ArrowLeft":
                event.preventDefault();
                moveCursor(addDays(cursor, -1));
                break;
            case "ArrowRight":
                event.preventDefault();
                moveCursor(addDays(cursor, 1));
                break;
            case "ArrowUp":
                event.preventDefault();
                moveCursor(addDays(cursor, view === "day" ? -1 : -7));
                break;
            case "ArrowDown":
                event.preventDefault();
                moveCursor(addDays(cursor, view === "day" ? 1 : 7));
                break;
            case "Home": {
                event.preventDefault();
                const offset = view === "day" ? 0 : (weekdayOf(cursor) - firstDayOfWeek + 7) % 7;
                moveCursor(addDays(cursor, -offset));
                break;
            }
            case "End": {
                event.preventDefault();
                const offset = view === "day" ? 6 : (weekdayOf(cursor) - firstDayOfWeek + 7) % 7;
                moveCursor(addDays(cursor, 6 - offset));
                break;
            }
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
                if (rangeAnchor !== null && selectedRange) confirmRange();
                else pick(cursor);
                break;
            case "Escape":
                if (selectedRange || rangeAnchor !== null) {
                    event.preventDefault();
                    rangeAnchor = null;
                    selectedRange = undefined;
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
        if (extending && rangeAnchor !== null) setRange(rangeAnchor, cursor);
    }

    function onDayCellClick(isoDate: string, event: MouseEvent): void {
        if (event.shiftKey && !disabledDay(isoDate)) {
            // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
            setRange(selectedDate && !selectedRange ? selectedDate : cursor, isoDate);
            cursor = isoDate;
            confirmRange();
            return;
        }
        cursor = isoDate;
        rangeAnchor = null;
        pick(isoDate);
    }
</script>

<!-- CalendarView.svelte -->
<div bind:this={rootEl} class={`calendar-view ${className}`.trim()} {...restProps}>
    {#if labels?.periodTitle || labels?.dayView || labels?.weekView || labels?.fourWeekView || labels?.monthView || labels?.agendaView}
        <div class="calendar-view-toolbar">
            <div class="calendar-view-switcher" role="group">
                {#if labels?.dayView}
                    <button
                        type="button"
                        class="calendar-view-switcher-button calendar-view-switcher-button-day"
                        aria-pressed={view === "day"}
                        onclick={() => setView("day")}
                    >{labels.dayView}</button>
                {/if}
                {#if labels?.weekView}
                    <button
                        type="button"
                        class="calendar-view-switcher-button calendar-view-switcher-button-week"
                        aria-pressed={view === "week"}
                        onclick={() => setView("week")}
                    >{labels.weekView}</button>
                {/if}
                {#if labels?.fourWeekView}
                    <button
                        type="button"
                        class="calendar-view-switcher-button calendar-view-switcher-button-four-week"
                        aria-pressed={view === "four-week"}
                        onclick={() => setView("four-week")}
                    >{labels.fourWeekView}</button>
                {/if}
                {#if labels?.monthView}
                    <button
                        type="button"
                        class="calendar-view-switcher-button calendar-view-switcher-button-month"
                        aria-pressed={view === "month"}
                        onclick={() => setView("month")}
                    >{labels.monthView}</button>
                {/if}
                {#if labels?.agendaView}
                    <button
                        type="button"
                        class="calendar-view-switcher-button calendar-view-switcher-button-agenda"
                        aria-pressed={view === "agenda"}
                        onclick={() => setView("agenda")}
                    >{labels.agendaView}</button>
                {/if}
            </div>
            <div class="calendar-view-nav">
                <button
                    type="button"
                    class="calendar-view-previous-button"
                    aria-label={labels?.previous?.(view)}
                    onclick={() => stepView(-1)}
                >‹</button>
                {#if labels?.periodTitle}
                    <span class="calendar-view-title">{labels.periodTitle(view, periodStart, periodEnd)}</span>
                {/if}
                {#if labels?.today}
                    <button
                        type="button"
                        class="calendar-view-today-button"
                        disabled={today == null}
                        onclick={goToday}
                    >{labels.today}</button>
                {/if}
                <button
                    type="button"
                    class="calendar-view-next-button"
                    aria-label={labels?.next?.(view)}
                    onclick={() => stepView(1)}
                >›</button>
            </div>
        </div>
    {/if}

    {#if hasExportButtons}
        <div class="calendar-view-export" role="group" aria-label={labels?.export}>
            {#if labels?.exportCsv}
                <button type="button" class="calendar-view-export-button" data-calendar-export-format="csv" disabled={exportEvents.length === 0} onclick={() => runExport("csv")}>{labels.exportCsv}</button>
            {/if}
            {#if labels?.exportTsv}
                <button type="button" class="calendar-view-export-button" data-calendar-export-format="tsv" disabled={exportEvents.length === 0} onclick={() => runExport("tsv")}>{labels.exportTsv}</button>
            {/if}
            {#if labels?.exportExcel}
                <button type="button" class="calendar-view-export-button" data-calendar-export-format="xlsx" disabled={exportEvents.length === 0} onclick={() => runExport("xlsx")}>{labels.exportExcel}</button>
            {/if}
        </div>
    {/if}

    {#if view === "agenda"}
        <!-- The agenda is a plain list of days, not a grid: ordinary tab stops, no roving cursor. -->
        <ol class="calendar-view-agenda" aria-label={label}>
            {#each agendaDays as d (d)}
                {@const weekday = weekdayOf(d)}
                {@const dayEvents = eventMap.get(d) ?? []}
                {@const isToday = today != null && d === today}
                {@const dayRanges = rangesFor(d)}
                {@const disabled = disabledDay(d)}
                <li
                    class="calendar-view-agenda-day"
                    data-date={d}
                    data-today={isToday ? "" : undefined}
                    data-weekend={weekendDays?.includes(weekday) ? "" : undefined}
                    data-range={dayRanges.length ? dayRanges.map((r) => r.kind ?? "range").join(" ") : undefined}
                    aria-current={isToday ? "date" : undefined}
                >
                    <time class="calendar-view-agenda-date" datetime={d}>{labels?.day?.(d, weekday, false) ?? d}</time>
                    {#if day}
                        {@render day({ date: d, events: dayEvents, visibleEvents: maxEvents == null ? dayEvents : dayEvents.slice(0, Math.max(0, maxEvents)), hiddenCount: maxEvents == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, maxEvents)), isToday, outsidePeriod: false, selected: false, disabled, inRange: false, ranges: dayRanges, openEvent, fieldText, eventProps })}
                    {:else if dayEvents.length > 0}
                        <ul class="calendar-view-agenda-events">
                            {#each dayEvents as calendarEvent (calendarEvent.id)}
                                <li data-event-key={calendarEvent.id}>
                                    <button type="button" class="calendar-view-event" onclick={() => openEvent(calendarEvent)}>{eventTitle(calendarEvent)}</button>
                                    {#if resolvedFields.length > 0}
                                        <span class="calendar-view-event-fields">
                                            {#each resolvedFields as f (f.id)}
                                                {@const text = eventFieldText(f, calendarEvent)}
                                                {@const editable = isFieldEditable(f)}
                                                {@const nameId = `${baseId}-fn-${calendarEvent.id}-${f.id}`}
                                                {@const valueId = `${baseId}-fv-${calendarEvent.id}-${f.id}`}
                                                {#if editing && editing.eventId === calendarEvent.id && editing.fieldId === f.id}
                                                    <span class="calendar-view-event-field" data-field={f.id} data-editing="">
                                                        <span class="calendar-view-event-field-name" id={nameId}>{f.header}</span>
                                                        {#if editorKind(f) === "select" || editorKind(f) === "radio"}
                                                            <select class="calendar-view-field-editor" aria-label={f.editLabel ?? f.header} bind:value={editing.draft} onkeydown={onFieldEditorKeydown} onchange={() => commitFieldEdit()} onblur={() => commitFieldEdit(false)}>
                                                                <option value=""></option>
                                                                {#each (f.options ?? []) as option (option.id)}
                                                                    <option value={option.id} disabled={option.disabled}>{option.label}</option>
                                                                {/each}
                                                            </select>
                                                        {:else}
                                                            <input
                                                                class="calendar-view-field-editor"
                                                                aria-label={f.editLabel ?? f.header}
                                                                type={editorKind(f) === "number" ? "number" : editorKind(f) === "date" ? "date" : editorKind(f) === "time" ? "time" : "text"}
                                                                inputmode={editorKind(f) === "number" ? "decimal" : undefined}
                                                                bind:value={editing.draft}
                                                                onkeydown={onFieldEditorKeydown}
                                                                onblur={() => commitFieldEdit(false)}
                                                            />
                                                        {/if}
                                                    </span>
                                                {:else if text !== "" || editable}
                                                    <span class="calendar-view-event-field" data-field={f.id} data-type={f.type ?? "text"}>
                                                        <span class="calendar-view-event-field-name" id={nameId}>{f.header}</span>
                                                        {#if editable}
                                                            <button type="button" class="calendar-view-field-button" id={valueId} aria-labelledby={`${nameId} ${valueId}`} onclick={() => void startFieldEdit(calendarEvent, f)}>{text}</button>
                                                        {:else}
                                                            <span class="calendar-view-event-field-value">{text}</span>
                                                        {/if}
                                                    </span>
                                                {/if}
                                            {/each}
                                        </span>
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ol>
        {#if agendaDays.length === 0 && labels?.agendaEmpty}
            <p class="calendar-view-agenda-empty">{labels.agendaEmpty}</p>
        {/if}
    {:else}
    <CalendarTable {label} class="calendar-view-table" onkeydown={onGridKeydown}>
        <CalendarTableHead>
            <CalendarTableRow>
                {#if showWeekNumbers}
                    <CalendarTableTH scope="col" data-week-number-header>{labels?.weekNumberHeader ?? ""}</CalendarTableTH>
                {/if}
                {#each { length: view === "day" ? 1 : 7 } as _, i (i)}
                    {@const weekday = view === "day" ? weekdayOf(anchorDate) : (firstDayOfWeek + i) % 7}
                    <CalendarTableTH scope="col">
                        {#if labels?.weekdayAbbr}
                            <abbr title={labels.weekday?.(weekday) ?? labels.weekdayAbbr(weekday)}>{labels.weekdayAbbr(weekday)}</abbr>
                        {:else if labels?.weekday}
                            {labels.weekday(weekday)}
                        {/if}
                    </CalendarTableTH>
                {/each}
            </CalendarTableRow>
        </CalendarTableHead>
        <CalendarTableBody>
            {#each days as week, rowIndex (rowIndex)}
                <CalendarTableRow>
                    {#if showWeekNumbers}
                        {@const weekNo = weekNumberOf(week)}
                        <CalendarTableTH scope="row" data-week-number={weekNo} aria-label={labels?.weekNumber?.(weekNo)}>{weekNo}</CalendarTableTH>
                    {/if}
                    {#each week as d (d)}
                        {@const weekday = weekdayOf(d)}
                        {@const outside = isOutsidePeriod(view, d, anchorDate)}
                        {@const isToday = today != null && d === today}
                        {@const dayEvents = eventMap.get(d) ?? []}
                        {@const disabled = disabledDay(d)}
                        {@const picked = selectionMode === "multiple" ? selectedDateSet.has(d) : selectedDate === d}
                        {@const inRange = inSelectedRange(d)}
                        {@const dayRanges = rangesFor(d)}
                        <CalendarTableTD
                            selected={d === cursor}
                            today={isToday}
                            data-date={d}
                            data-outside-period={outside ? "" : undefined}
                            data-weekend={weekendDays?.includes(weekday) ? "" : undefined}
                            data-selected={picked ? "" : undefined}
                            data-disabled={disabled ? "" : undefined}
                            data-in-range={inRange ? "" : undefined}
                            data-range-start={selectedRange?.start === d ? "" : undefined}
                            data-range-end={selectedRange?.end === d ? "" : undefined}
                            data-range={dayRanges.length ? dayRanges.map((r) => r.kind ?? "range").join(" ") : undefined}
                            aria-disabled={disabled || undefined}
                            aria-label={labels?.day?.(d, weekday, outside)}
                            onclick={(e: MouseEvent) => onDayCellClick(d, e)}
                            ondragover={onDayDragOver}
                            ondrop={(e: DragEvent) => onDayDrop(d, e)}
                        >
                            {#if hideOutsideDays && outside}
                                <!-- a hidden outside day stays an empty, focusable cell -->
                            {:else if day}
                                {@render day({ date: d, events: dayEvents, visibleEvents: maxEvents == null ? dayEvents : dayEvents.slice(0, Math.max(0, maxEvents)), hiddenCount: maxEvents == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, maxEvents)), isToday, outsidePeriod: outside, selected: picked, disabled, inRange, ranges: dayRanges, openEvent, fieldText, eventProps })}
                            {:else}
                                {parseIsoDate(d)?.day}
                            {/if}
                        </CalendarTableTD>
                    {/each}
                </CalendarTableRow>
            {/each}
        </CalendarTableBody>
    </CalendarTable>
    {/if}

    <div class="calendar-view-status" aria-live="polite">{statusMessage}</div>
</div>
