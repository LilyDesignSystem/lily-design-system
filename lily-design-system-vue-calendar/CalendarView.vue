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

export type CalendarView = "day" | "week" | "four-week" | "month";

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
};

export type Props = {
    /** Accessible name for the calendar, passed through to CalendarTable. */
    label: string;
    /** ISO date marking "today"; never computed internally (stays SSR-safe). */
    today?: string;
    /** Events to place into day cells. */
    events?: CalendarEvent[];
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
    /** Marked ranges (holidays, closures): each day inside gets `data-range="{kind}"`. */
    ranges?: CalendarRange[];
    /** BCP 47 locale, passed to firstDayOfWeekFor. */
    locale?: string;
    labels?: CalendarViewLabels;
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
    if (view === "month") {
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
import { computed, getCurrentInstance, nextTick, ref, watch } from "vue";
import {
    CalendarTable,
    CalendarTableBody,
    CalendarTableHead,
    CalendarTableRow,
    CalendarTableTD,
    CalendarTableTH,
} from "@lilydesignsystem/vue-headless";

const props = withDefaults(defineProps<Props>(), {
    today: undefined,
    events: () => [],
    maxEvents: undefined,
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
    class: "",
});

// Each is a v-model: bound by the parent when `v-model:x` is used, a local
// ref otherwise. The Svelte canonical's `$bindable` props, in Vue's idiom.
const view = defineModel<CalendarView>("view", { default: "month" });
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
}>();

defineSlots<{ day?: (args: DayArgs) => unknown }>();

const rootEl = ref<HTMLDivElement | null>(null);
const cursor = ref(anchorDate.value);
const statusMessage = ref("");

const firstDayOfWeek = computed(() => firstDayOfWeekFor(props.locale));
const days = computed(() => periodDays(view.value, anchorDate.value, firstDayOfWeek.value));
const flatDays = computed(() => days.value.flat());
const eventMap = computed(() => eventsByDay(props.events));

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
    const calendarEvent = props.events.find((e) => e.id === id);
    if (calendarEvent) moveEventTo(calendarEvent, isoDate);
}

function announce(): void {
    const l = props.labels;
    if (!l?.periodAnnouncement) return;
    const [start, end] = periodRange(view.value, anchorDate.value, firstDayOfWeek.value);
    statusMessage.value = l.periodAnnouncement(view.value, start, end);
}

function navigateTo(nextAnchor: string): void {
    anchorDate.value = nextAnchor;
    const [start, end] = periodRange(view.value, anchorDate.value, firstDayOfWeek.value);
    emit("navigate", view.value, start, end);
    announce();
}

function stepView(delta: 1 | -1): void {
    if (view.value === "day") navigateTo(addDays(anchorDate.value, delta));
    else if (view.value === "week") navigateTo(addDays(anchorDate.value, delta * 7));
    else if (view.value === "four-week") navigateTo(addDays(anchorDate.value, delta * 28));
    else navigateTo(addMonths(anchorDate.value, delta));
}

function goToday(): void {
    if (props.today == null) return;
    navigateTo(props.today);
}

function setView(next: CalendarView): void {
    view.value = next;
    const [start, end] = periodRange(view.value, anchorDate.value, firstDayOfWeek.value);
    emit("navigate", view.value, start, end);
    announce();
}

async function focusCursor(): Promise<void> {
    await nextTick();
    rootEl.value?.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')?.focus({ preventScroll: true });
}

/** Move the cursor, re-paging the visible period when it leaves it. */
function moveCursor(next: string): void {
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
    if (movable.value && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        const el = (event.target as HTMLElement).closest<HTMLElement>("[data-event-id]");
        const fromDate = el?.closest<HTMLElement>("[data-date]")?.dataset.date;
        const calendarEvent = props.events.find((e) => e.id === el?.dataset.eventId);
        if (el && fromDate && calendarEvent) {
            event.preventDefault();
            const week = view.value === "day" ? 1 : 7;
            const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[event.key as string]!;
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
    switch (event.key) {
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
const periodStart = computed(() => periodRange(view.value, anchorDate.value, firstDayOfWeek.value)[0]);
const periodEnd = computed(() => periodRange(view.value, anchorDate.value, firstDayOfWeek.value)[1]);

function cellView(d: string) {
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
        picked: props.selectionMode === "multiple" ? selectedDates.value.includes(d) : selectedDate.value === d,
        inRange: !!selectedRange.value && d >= selectedRange.value.start && d <= selectedRange.value.end,
        ranges: props.ranges.filter((r) => d >= r.start && d <= r.end),
    };
}
</script>

<template>
    <!-- CalendarView.vue -->
    <div ref="rootEl" :class="`calendar-view ${props.class ?? ''}`.trim()">
        <div v-if="labels?.periodTitle || labels?.dayView || labels?.weekView || labels?.fourWeekView || labels?.monthView" class="calendar-view-toolbar">
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
            </div>
            <div class="calendar-view-nav">
                <button
                    type="button"
                    class="calendar-view-previous-button"
                    :aria-label="labels?.previous?.(view)"
                    @click="stepView(-1)"
                >‹</button>
                <span v-if="labels?.periodTitle" class="calendar-view-title">{{ labels.periodTitle(view, periodStart, periodEnd) }}</span>
                <button
                    v-if="labels?.today"
                    type="button"
                    class="calendar-view-today-button"
                    :disabled="today == null"
                    @click="goToday"
                >{{ labels.today }}</button>
                <button
                    type="button"
                    class="calendar-view-next-button"
                    :aria-label="labels?.next?.(view)"
                    @click="stepView(1)"
                >›</button>
            </div>
        </div>

        <CalendarTable :label="label" class="calendar-view-table" @keydown="onGridKeydown">
            <CalendarTableHead>
                <CalendarTableRow>
                    <CalendarTableTH v-if="showWeekNumbers" scope="col" data-week-number-header>{{ labels?.weekNumberHeader ?? "" }}</CalendarTableTH>
                    <CalendarTableTH v-for="(weekday, i) in weekdays" :key="i" scope="col">
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
                        @click="(e: MouseEvent) => onDayCellClick(d, e)"
                        @dragover="onDayDragOver"
                        @drop="(e: DragEvent) => onDayDrop(d, e)"
                    >
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
                            :event-props="eventProps"
                        >{{ parseIsoDate(d)?.day }}</slot>
                    </CalendarTableTD>
                </CalendarTableRow>
            </CalendarTableBody>
        </CalendarTable>

        <div class="calendar-view-status" aria-live="polite">{{ statusMessage }}</div>
    </div>
</template>
