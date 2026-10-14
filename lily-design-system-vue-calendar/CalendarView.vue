<script lang="ts">
import {
    addDays,
    addMonths,
    daysInMonth,
    firstDayOfWeekFor,
    formatIsoDate,
    monthMatrix,
    parseIsoDate,
    weekdayOf,
} from "@lilydesignsystem/vue-date-time-picker";

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

export type Props = {
    /** Accessible name for the calendar, passed through to CalendarTable. */
    label: string;
    /** ISO date marking "today"; never computed internally (stays SSR-safe). */
    today?: string;
    /** Events to place into day cells. */
    events?: CalendarEvent[];
    /** Earliest pickable ISO date. */
    minDate?: string;
    /** Latest pickable ISO date. */
    maxDate?: string;
    /** Extra disabled-day test. Disabled days stay focusable but cannot be picked. */
    isDisabled?: (isoDate: string) => boolean;
    /** BCP 47 locale, passed to firstDayOfWeekFor. */
    locale?: string;
    labels?: CalendarViewLabels;
    /** Extra CSS class on the root. */
    class?: string;
};

export type DayArgs = {
    date: string;
    events: CalendarEvent[];
    isToday: boolean;
    outsidePeriod: boolean;
    selected: boolean;
    disabled: boolean;
    /** Call from the event's own button/click handler to emit `event-click`. */
    openEvent: (calendarEvent: CalendarEvent) => void;
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
import { computed, nextTick, ref, watch } from "vue";
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
    minDate: undefined,
    maxDate: undefined,
    isDisabled: undefined,
    locale: undefined,
    labels: undefined,
    class: "",
});

// Each is a v-model: bound by the parent when `v-model:x` is used, a local
// ref otherwise. The Svelte canonical's `$bindable` props, in Vue's idiom.
const view = defineModel<CalendarView>("view", { default: "month" });
const anchorDate = defineModel<string>("anchorDate", { default: "1970-01-01" });
const selectedDate = defineModel<string | undefined>("selectedDate", { default: undefined });

const emit = defineEmits<{
    /** The visible period changed: view switch, previous/next/today, or a keyboard re-page. */
    (event: "navigate", view: CalendarView, start: string, end: string): void;
    /** An enabled day cell was activated (Enter/Space, or click). */
    (event: "day-click", isoDate: string): void;
    /** A rendered event was activated, via the `day` slot's `openEvent`. */
    (event: "event-click", calendarEvent: CalendarEvent): void;
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

function pick(isoDate: string): void {
    if (disabledDay(isoDate)) return;
    selectedDate.value = isoDate;
    emit("day-click", isoDate);
}

function openEvent(calendarEvent: CalendarEvent): void {
    emit("event-click", calendarEvent);
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
    if (view.value === "week") navigateTo(addDays(anchorDate.value, delta * 7));
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
    if (view.value === "week") moveCursor(addDays(cursor.value, delta * 7));
    else if (view.value === "four-week") moveCursor(addDays(cursor.value, delta * 28));
    else moveCursor(addMonths(cursor.value, delta));
}

function onGridKeydown(event: KeyboardEvent): void {
    const offset = (weekdayOf(cursor.value) - firstDayOfWeek.value + 7) % 7;
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
            moveCursor(addDays(cursor.value, -7));
            break;
        case "ArrowDown":
            event.preventDefault();
            moveCursor(addDays(cursor.value, 7));
            break;
        case "Home":
            event.preventDefault();
            moveCursor(addDays(cursor.value, -offset));
            break;
        case "End":
            event.preventDefault();
            moveCursor(addDays(cursor.value, 6 - offset));
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
            pick(cursor.value);
            break;
        case "t":
        case "T":
            if (props.today == null || event.ctrlKey || event.metaKey || event.altKey) break;
            event.preventDefault();
            navigateTo(props.today);
            moveCursor(props.today);
            break;
    }
}

function onDayCellClick(isoDate: string): void {
    cursor.value = isoDate;
    pick(isoDate);
}

const weekdays = computed(() => Array.from({ length: 7 }, (_, i) => (firstDayOfWeek.value + i) % 7));

function cellView(d: string) {
    const outside = isOutsidePeriod(view.value, d, anchorDate.value);
    return {
        date: d,
        weekday: weekdayOf(d),
        outside,
        isToday: props.today != null && d === props.today,
        events: eventMap.value.get(d) ?? [],
        disabled: disabledDay(d),
        picked: selectedDate.value === d,
    };
}
</script>

<template>
    <!-- CalendarView.vue -->
    <div ref="rootEl" :class="`calendar-view ${props.class ?? ''}`.trim()">
        <div v-if="labels?.weekView || labels?.fourWeekView || labels?.monthView" class="calendar-view-toolbar">
            <div class="calendar-view-switcher" role="group">
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
                    <CalendarTableTD
                        v-for="d in week"
                        :key="d"
                        :selected="d === cursor"
                        :today="cellView(d).isToday"
                        :data-date="d"
                        :data-outside-period="cellView(d).outside ? '' : undefined"
                        :data-selected="cellView(d).picked ? '' : undefined"
                        :data-disabled="cellView(d).disabled ? '' : undefined"
                        :aria-disabled="cellView(d).disabled ? 'true' : undefined"
                        :aria-label="labels?.day?.(d, cellView(d).weekday, cellView(d).outside)"
                        @click="onDayCellClick(d)"
                    >
                        <slot
                            name="day"
                            :date="d"
                            :events="cellView(d).events"
                            :is-today="cellView(d).isToday"
                            :outside-period="cellView(d).outside"
                            :selected="cellView(d).picked"
                            :disabled="cellView(d).disabled"
                            :open-event="openEvent"
                        >{{ parseIsoDate(d)?.day }}</slot>
                    </CalendarTableTD>
                </CalendarTableRow>
            </CalendarTableBody>
        </CalendarTable>

        <div class="calendar-view-status" aria-live="polite">{{ statusMessage }}</div>
    </div>
</template>
