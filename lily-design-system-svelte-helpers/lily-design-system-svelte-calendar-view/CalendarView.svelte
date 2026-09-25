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
        monthMatrix,
        parseIsoDate,
        weekdayOf,
    } from "@lilydesignsystem/svelte-date-time-picker";

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
     * Every field is optional, but its presence gates the control it
     * names — no baked-in English fallback, matching every other
     * helper's label-gating convention. See spec/index.md §5.
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
        /** Full accessible name for one day cell, e.g. "11, Tuesday, 6 January 2026". */
        day?: (isoDate: string, weekday: number, outsidePeriod: boolean) => string;
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
        /** ISO date marking "today"; never computed internally (stays SSR-safe). */
        today?: string;
        /** BCP 47 locale, passed to firstDayOfWeekFor. */
        locale?: string;
        labels?: CalendarViewLabels;
        /** Fired whenever the visible period changes: view switch, previous/next/today, or a keyboard re-page. */
        onNavigate?: (view: CalendarView, start: string, end: string) => void;
        /** Fired when a day cell is activated (Enter/Space, or click). */
        onDayClick?: (isoDate: string) => void;
        /** Fired when a rendered event is activated. Consumer wires this to the `day` snippet's own click handler. */
        onEventClick?: (calendarEvent: CalendarEvent) => void;
        [key: string]: unknown;
    };

    export type DayArgs = {
        date: string;
        events: CalendarEvent[];
        isToday: boolean;
        outsidePeriod: boolean;
    };

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

    /** The inclusive [start, end] ISO range `view` covers, anchored around `anchorDate`. */
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
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        view = $bindable("month"),
        anchorDate = $bindable(),
        events = [],
        today = undefined,
        locale = undefined,
        labels = undefined,
        onNavigate = undefined,
        onDayClick = undefined,
        onEventClick: _onEventClick = undefined,
        day,
        ...restProps
    }: Props & { day?: Snippet<[DayArgs]> } = $props();

    let rootEl: HTMLDivElement | undefined = $state();
    let cursor = $state(anchorDate);
    let statusMessage = $state("");

    const firstDayOfWeek = $derived(firstDayOfWeekFor(locale));
    const days = $derived.by(() => periodDays(view, anchorDate, firstDayOfWeek));
    const flatDays = $derived(days.flat());
    const eventMap = $derived.by(() => eventsByDay(events));

    // Keep the roving-tabindex cursor inside the currently visible days
    // whenever the period changes from outside (a prop change, not our
    // own keyboard navigation, which already keeps `cursor` in sync).
    $effect(() => {
        if (flatDays.length === 0) return;
        if (flatDays.includes(cursor)) return;
        cursor = flatDays.includes(anchorDate) ? anchorDate : flatDays[0];
    });

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
        if (view === "week") navigateTo(addDays(anchorDate, delta * 7));
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
        if (view === "week") moveCursor(addDays(cursor, delta * 7));
        else if (view === "four-week") moveCursor(addDays(cursor, delta * 28));
        else moveCursor(addMonths(cursor, delta));
    }

    function onGridKeydown(event: KeyboardEvent): void {
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
                moveCursor(addDays(cursor, -7));
                break;
            case "ArrowDown":
                event.preventDefault();
                moveCursor(addDays(cursor, 7));
                break;
            case "Home": {
                event.preventDefault();
                const offset = (weekdayOf(cursor) - firstDayOfWeek + 7) % 7;
                moveCursor(addDays(cursor, -offset));
                break;
            }
            case "End": {
                event.preventDefault();
                const offset = (weekdayOf(cursor) - firstDayOfWeek + 7) % 7;
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
                onDayClick?.(cursor);
                break;
        }
    }

    function onDayCellClick(isoDate: string): void {
        cursor = isoDate;
        onDayClick?.(isoDate);
    }
</script>

<!-- CalendarView.svelte -->
<div bind:this={rootEl} class={`calendar-view ${className}`.trim()} {...restProps}>
    {#if labels?.weekView || labels?.fourWeekView || labels?.monthView}
        <div class="calendar-view-toolbar">
            <div class="calendar-view-switcher" role="group">
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
            </div>
            <div class="calendar-view-nav">
                <button
                    type="button"
                    class="calendar-view-previous-button"
                    aria-label={labels?.previous?.(view)}
                    onclick={() => stepView(-1)}
                >‹</button>
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

    <CalendarTable {label} class="calendar-view-table" onkeydown={onGridKeydown}>
        <CalendarTableHead>
            <CalendarTableRow>
                {#each { length: 7 } as _, i (i)}
                    {@const weekday = (firstDayOfWeek + i) % 7}
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
                    {#each week as d (d)}
                        {@const weekday = weekdayOf(d)}
                        {@const outside = isOutsidePeriod(view, d, anchorDate)}
                        {@const isToday = today != null && d === today}
                        {@const dayEvents = eventMap.get(d) ?? []}
                        <CalendarTableTD
                            selected={d === cursor}
                            today={isToday}
                            data-date={d}
                            data-outside-period={outside ? "" : undefined}
                            aria-label={labels?.day?.(d, weekday, outside)}
                            onclick={() => onDayCellClick(d)}
                        >
                            {#if day}
                                {@render day({ date: d, events: dayEvents, isToday, outsidePeriod: outside })}
                            {:else}
                                {parseIsoDate(d)?.day}
                            {/if}
                        </CalendarTableTD>
                    {/each}
                </CalendarTableRow>
            {/each}
        </CalendarTableBody>
    </CalendarTable>

    <div class="calendar-view-status" aria-live="polite">{statusMessage}</div>
</div>
