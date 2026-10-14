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

    export type CalendarView = "day" | "week" | "four-week" | "month";

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
        /** Spread onto an event's element to make it draggable and keyboard-movable: `{...eventProps(ev)}`. Empty without `onEventMove`. */
        eventProps: (calendarEvent: CalendarEvent) => Record<string, unknown>;
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
        maxEvents = undefined,
        hideOutsideDays = false,
        weekendDays = undefined,
        onEventMove = undefined,
        today = undefined,
        selectedDate = $bindable(undefined),
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

    const rangesFor = (isoDate: string) => ranges.filter((r) => isoDate >= r.start && isoDate <= r.end);

    /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
    function weekNumberOf(row: string[]): number {
        const thursday = row.find((d) => weekdayOf(d) === 4) ?? row[0];
        return isoWeek(thursday);
    }

    function pick(isoDate: string): void {
        if (disabledDay(isoDate)) return;
        selectedDate = isoDate;
        onDayClick?.(isoDate);
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
        const calendarEvent = events.find((e) => e.id === id);
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
            const calendarEvent = events.find((e) => e.id === el?.dataset.eventId);
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
    {#if labels?.periodTitle || labels?.dayView || labels?.weekView || labels?.fourWeekView || labels?.monthView}
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
                        {@const picked = selectedDate === d}
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
                                {@render day({ date: d, events: dayEvents, visibleEvents: maxEvents == null ? dayEvents : dayEvents.slice(0, Math.max(0, maxEvents)), hiddenCount: maxEvents == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, maxEvents)), isToday, outsidePeriod: outside, selected: picked, disabled, inRange, ranges: dayRanges, openEvent, eventProps })}
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
