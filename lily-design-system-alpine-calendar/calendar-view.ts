/**
 * CalendarView for Alpine.js: the state and behaviour behind `snippet.html`. Headless: no CSS, no text, no icons; every string
 * is a `labels.*` value and a label's absence removes the control it names. Dates are ISO `YYYY-MM-DD` strings handled in UTC, so
 * no time zone ever shifts a day; the component never reads the clock unless `today` is left out, and picks no locale — weekday
 * and period text come from `labels`.
 *
 * Month and week views, previous / next / today, a picked day, disabled days (focusable, not pickable), `minDate` / `maxDate`
 * bounds, events as buttons inside their day, and the WAI-ARIA APG date-grid keys with a roving tabindex. What it does not do yet:
 * the four-week view, typed event fields and editing, search, filter, export (see spec/index.md).
 */
import { isRtl, logicalKey } from "./direction.js";

export type CalendarEvent = { id: string; date: string; title: string };
export type CalendarViewName = "month" | "week";

export type CalendarLabels = {
    grid?: string;
    monthView?: string;
    weekView?: string;
    today?: string;
    previous?: (view: CalendarViewName) => string;
    next?: (view: CalendarViewName) => string;
    /** Abbreviated weekday for a column header; 0 is Sunday. */
    weekdayAbbr?: (day: number) => string;
    weekdayName?: (day: number) => string;
    /** Visible title of the shown period. */
    periodTitle?: (start: string, end: string, view: CalendarViewName) => string;
    /** Announced (polite) whenever the shown period changes. */
    periodAnnouncement?: (start: string, end: string, view: CalendarViewName) => string;
    dayLabel?: (date: string) => string;
};

export type CalendarOptions = {
    view?: CalendarViewName;
    /** Any date inside the period to show. Defaults to `today`. */
    anchor?: string;
    /** The current date; left out, the component reads the system date once. */
    today?: string;
    picked?: string;
    /** First column: 0 Sunday … 6 Saturday. Default 0. */
    weekStart?: number;
    events?: CalendarEvent[];
    minDate?: string;
    maxDate?: string;
    isDisabled?: (date: string) => boolean;
    labels?: CalendarLabels;
};

// ---- pure date maths on ISO strings (UTC) -------------------------------------------------------------------------------
const MS = 86_400_000;
const parse = (iso: string): number => Date.parse(iso + "T00:00:00Z");
const format = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

export const addDays = (iso: string, n: number): string => format(parse(iso) + n * MS);
/** Day of week, 0 = Sunday. */
export const dayOfWeek = (iso: string): number => new Date(parse(iso)).getUTCDay();
export const startOfWeek = (iso: string, weekStart: number): string => addDays(iso, -((dayOfWeek(iso) - weekStart + 7) % 7));
export const daysInMonth = (iso: string): number => new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7), 0)).getUTCDate();
export const monthStart = (iso: string): string => iso.slice(0, 8) + "01";
/** `n` months on, the day clamped to the target month's length (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(iso: string, n: number): string {
    const total = +iso.slice(0, 4) * 12 + (+iso.slice(5, 7) - 1) + n;
    const year = Math.floor(total / 12);
    const month = (total % 12) + 1;
    const first = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-01`;
    return first.slice(0, 8) + String(Math.min(+iso.slice(8, 10), daysInMonth(first))).padStart(2, "0");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const define = <T extends object>(object: T & ThisType<any>): T => object;

export function createCalendarView(options: CalendarOptions = {}) {
    const today = options.today ?? new Date().toISOString().slice(0, 10);
    const start = options.anchor ?? today;
    return define({
        view: (options.view ?? "month") as CalendarViewName,
        anchor: start,
        today,
        picked: options.picked ?? "",
        weekStart: options.weekStart ?? 0,
        events: options.events ?? [],
        labels: options.labels ?? ({} as CalendarLabels),
        /** The day the keyboard is on. */
        active: start,
        status: "",

        // ---- the shown period ------------------------------------------------------------------------------------
        /** First and last day of the period itself (the month, or the week). */
        get range(): { start: string; end: string } {
            if (this.view === "week") {
                const first = startOfWeek(this.anchor, this.weekStart);
                return { start: first, end: addDays(first, 6) };
            }
            const first = monthStart(this.anchor);
            return { start: first, end: first.slice(0, 8) + String(daysInMonth(first)).padStart(2, "0") };
        },
        /** Every day of the grid: whole weeks, so a month shows its neighbours' days too. */
        get days(): string[] {
            const first = startOfWeek(this.range.start, this.weekStart);
            const last = addDays(startOfWeek(this.range.end, this.weekStart), 6);
            const out: string[] = [];
            for (let d = first; d <= last; d = addDays(d, 1)) out.push(d);
            return out;
        },
        get weeks(): string[][] {
            const out: string[][] = [];
            for (let i = 0; i < this.days.length; i += 7) out.push(this.days.slice(i, i + 7));
            return out;
        },
        get weekdays(): number[] {
            return Array.from({ length: 7 }, (_, i) => (this.weekStart + i) % 7);
        },
        get title(): string {
            return this.labels.periodTitle?.(this.range.start, this.range.end, this.view) ?? "";
        },

        // ---- days ------------------------------------------------------------------------------------------------
        dayNumber(iso: string): string {
            return String(+iso.slice(8, 10));
        },
        eventsOn(iso: string): CalendarEvent[] {
            return this.events.filter((e: CalendarEvent) => e.date === iso);
        },
        isOutside(iso: string): boolean {
            return this.view === "month" && (iso < this.range.start || iso > this.range.end);
        },
        isDisabled(iso: string): boolean {
            return (!!options.minDate && iso < options.minDate) || (!!options.maxDate && iso > options.maxDate) || !!options.isDisabled?.(iso);
        },
        dayName(iso: string): string {
            return this.labels.dayLabel?.(iso) ?? "";
        },

        // ---- navigation ------------------------------------------------------------------------------------------
        /** Move the shown period by `n` (months in month view, weeks in week view); the keyboard day comes along. */
        shift(n: number): void {
            const next = this.view === "week" ? addDays(this.anchor, 7 * n) : addMonths(this.anchor, n);
            this.show(next, this.view === "week" ? addDays(this.active, 7 * n) : addMonths(this.active, n));
        },
        /** The period `n` steps away would lie wholly outside minDate / maxDate. */
        canShift(n: number): boolean {
            const next = this.view === "week" ? addDays(this.anchor, 7 * n) : addMonths(this.anchor, n);
            const first = this.view === "week" ? startOfWeek(next, this.weekStart) : monthStart(next);
            const last = this.view === "week" ? addDays(first, 6) : first.slice(0, 8) + String(daysInMonth(first)).padStart(2, "0");
            return !((options.minDate && last < options.minDate) || (options.maxDate && first > options.maxDate));
        },
        previous(): void {
            if (this.canShift(-1)) this.shift(-1);
        },
        next(): void {
            if (this.canShift(1)) this.shift(1);
        },
        goToday(): void {
            if (this.isDisabled(this.today) && (options.minDate || options.maxDate)) return;
            this.show(this.today, this.today);
        },
        setView(view: CalendarViewName): void {
            this.view = view;
            this.announce();
        },
        /** Show the period holding `anchor`, with the keyboard on `active`, and announce the change. */
        show(anchor: string, active = anchor): void {
            const before = this.range.start + this.view;
            this.anchor = anchor;
            this.active = active;
            if (this.range.start + this.view !== before) this.announce();
        },
        announce(): void {
            this.status = this.labels.periodAnnouncement?.(this.range.start, this.range.end, this.view) ?? "";
        },
        pick(iso: string): void {
            if (this.isDisabled(iso)) return;
            this.picked = iso;
            this.$dispatch?.("lily:pick", { date: iso });
        },
        openEvent(id: string): void {
            this.$dispatch?.("lily:event", { id });
        },

        // ---- keyboard --------------------------------------------------------------------------------------------
        tabindex(iso: string): string {
            return iso === this.active ? "0" : "-1";
        },
        onFocusDay(iso: string): void {
            this.active = iso;
        },
        focusDay(): void {
            this.$nextTick?.(() => (this.$root?.querySelector(`[data-date="${this.active}"]`) as HTMLElement | null)?.focus());
        },
        onKeydown(event: KeyboardEvent): void {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const key = logicalKey(event.key, isRtl(this.$root));
            let next: string | null = null;
            switch (key) {
                case "ArrowRight": next = addDays(this.active, 1); break;
                case "ArrowLeft": next = addDays(this.active, -1); break;
                case "ArrowDown": next = addDays(this.active, 7); break;
                case "ArrowUp": next = addDays(this.active, -7); break;
                case "Home": next = startOfWeek(this.active, this.weekStart); break;
                case "End": next = addDays(startOfWeek(this.active, this.weekStart), 6); break;
                case "PageDown": next = this.view === "week" ? addDays(this.active, 7) : addMonths(this.active, 1); break;
                case "PageUp": next = this.view === "week" ? addDays(this.active, -7) : addMonths(this.active, -1); break;
                case "Enter":
                case " ":
                    event.preventDefault();
                    this.pick(this.active);
                    return;
                case "t":
                case "T":
                    event.preventDefault();
                    this.goToday();
                    this.focusDay();
                    return;
                default:
                    return;
            }
            event.preventDefault();
            if (options.minDate && next < options.minDate) next = options.minDate;
            if (options.maxDate && next > options.maxDate) next = options.maxDate;
            const shown = this.days.includes(next) && !this.isOutside(next);
            if (shown) this.active = next;
            else this.show(next);
            this.focusDay();
        },
    });
}

/** The Alpine plugin: registers `Alpine.data("lilyCalendarView", options => …)`. */
export default function lilyCalendarView(Alpine: { data: (name: string, factory: (...args: never[]) => object) => void }): void {
    Alpine.data("lilyCalendarView", ((options?: CalendarOptions) => createCalendarView(options)) as (...args: never[]) => object);
}
