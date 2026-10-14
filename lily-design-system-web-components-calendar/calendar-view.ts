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

export type CalendarViewMode = "week" | "four-week" | "month";

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
    /** Visible text for the week-number column header (e.g. "Wk"). */
    weekNumberHeader?: string;
    /** Accessible name for a week-number cell (e.g. "Week 3"). Without it the bare number is the name. */
    weekNumber?: (week: number) => string;
    /** Announced as a range is extended with Shift+arrows or confirmed. */
    rangeAnnouncement?: (start: string, end: string) => string;
};

/** What `renderDay` receives for one day cell. */
export type CalendarViewDayArgs = {
    date: string;
    events: CalendarEvent[];
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
    class?: string;
};

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate: string, firstDayOfWeek: number): string {
    const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
    return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(view: CalendarViewMode, anchorDate: string, firstDayOfWeek: number): string[][] {
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
export function periodRange(view: CalendarViewMode, anchorDate: string, firstDayOfWeek: number): [string, string] {
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

const VIEWS: CalendarViewMode[] = ["week", "four-week", "month"];

/** Custom-element class implementing `<lily-calendar-view>`. */
export class CalendarView extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "view", "anchor-date", "selected-date", "today", "min-date", "max-date", "locale", "class", "show-week-numbers"];
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
    static readonly #MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
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
        for (const event of args.events) {
            if (typeof event["title"] !== "string") continue;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "calendar-view-event";
            button.textContent = event["title"] as string;
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                args.openEvent(event);
            });
            fragment.appendChild(button);
        }
        return fragment;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
    }

    attributeChangedCallback(): void {
        this.#render();
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
        return periodDays(this.view, this.anchorDate, this.#firstDay()).flat();
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

    #pick(isoDate: string): void {
        if (this.#isDisabledDay(isoDate)) return;
        this.#cursor = isoDate;
        this.selectedDate = isoDate;
        this.#onDayClick?.(isoDate);
        this.dispatchEvent(new CustomEvent<string>("dayclick", { detail: isoDate, bubbles: true, composed: true }));
    }

    #openEvent(calendarEvent: CalendarEvent): void {
        this.#onEventClick?.(calendarEvent);
        this.dispatchEvent(
            new CustomEvent<CalendarEvent>("eventclick", { detail: calendarEvent, bubbles: true, composed: true }),
        );
    }

    #announce(view: CalendarViewMode, anchor: string): void {
        if (!this.#labels.periodAnnouncement) return;
        const [start, end] = periodRange(view, anchor, this.#firstDay());
        this.#statusMessage = this.#labels.periodAnnouncement(view, start, end);
    }

    /** Fire navigation for the current state, then re-render with the new announcement. */
    #emitNavigate(view: CalendarViewMode, anchor: string): void {
        const [start, end] = periodRange(view, anchor, this.#firstDay());
        this.#announce(view, anchor);
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
        this.#emitNavigate(this.view, nextAnchor);
        this.#render();
    }

    #stepView(delta: 1 | -1): void {
        const anchor = this.anchorDate;
        if (this.view === "week") this.#navigateTo(addDays(anchor, delta * 7));
        else if (this.view === "four-week") this.#navigateTo(addDays(anchor, delta * 28));
        else this.#navigateTo(addMonths(anchor, delta));
    }

    #goToday(): void {
        if (!this.today) return;
        this.#navigateTo(this.today);
    }

    #setView(next: CalendarViewMode): void {
        this.setAttribute("view", next);
        this.#emitNavigate(next, this.anchorDate);
        this.#render();
    }

    /** Move the cursor, re-paging the visible period when it leaves it. */
    #moveCursor(next: string): void {
        this.#cursor = next;
        const view = this.view;
        const anchorDate = this.anchorDate;
        if (view === "month") {
            const cp = parseIsoDate(next);
            const anchor = parseIsoDate(anchorDate);
            if (cp && anchor && (cp.year !== anchor.year || cp.month !== anchor.month)) {
                this.setAttribute("anchor-date", formatIsoDate({ year: cp.year, month: cp.month, day: 1 }));
                this.#emitNavigate(view, this.anchorDate);
            }
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
        if (this.view === "week") this.#moveCursor(addDays(cursor, delta * 7));
        else if (this.view === "four-week") this.#moveCursor(addDays(cursor, delta * 28));
        else this.#moveCursor(addMonths(cursor, delta));
    }

    #onGridKeydown(event: KeyboardEvent): void {
        const cursor = this.#effectiveCursor(this.#visibleDays());
        const offset = (weekdayOf(cursor) - this.#firstDay() + 7) % 7;
        const extending = event.shiftKey && CalendarView.#MOVE_KEYS.has(event.key);
        if (extending && this.#rangeAnchor === null) {
            this.#rangeAnchor = this.selectedDate && !this.#selectedRange ? this.selectedDate : cursor;
        }
        if (!extending && CalendarView.#MOVE_KEYS.has(event.key)) this.#rangeAnchor = null;
        switch (event.key) {
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
                this.#moveCursor(addDays(cursor, -7));
                break;
            case "ArrowDown":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, 7));
                break;
            case "Home":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, -offset));
                break;
            case "End":
                event.preventDefault();
                this.#moveCursor(addDays(cursor, 6 - offset));
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
                this.#emitNavigate(this.view, this.today);
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
        const view = this.view;
        const anchorDate = this.anchorDate;
        const firstDay = this.#firstDay();
        const days = periodDays(view, anchorDate, firstDay);
        const flatDays = days.flat();
        const cursor = this.#effectiveCursor(flatDays);
        this.#cursor = cursor;
        const eventMap = eventsByDay(this.#events);

        const root = document.createElement("div");
        root.className = `calendar-view ${this.getAttribute("class") ?? ""}`.trim();

        if (labels.weekView || labels.fourWeekView || labels.monthView) {
            const toolbar = document.createElement("div");
            toolbar.className = "calendar-view-toolbar";

            const switcher = document.createElement("div");
            switcher.className = "calendar-view-switcher";
            switcher.setAttribute("role", "group");
            const entries: [CalendarViewMode, string | undefined][] = [
                ["week", labels.weekView],
                ["four-week", labels.fourWeekView],
                ["month", labels.monthView],
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
            nav.appendChild(previous);
            if (labels.today) {
                const todayButton = this.#button("calendar-view-today-button", labels.today, () => this.#goToday());
                todayButton.disabled = !this.today;
                nav.appendChild(todayButton);
            }
            const next = this.#button("calendar-view-next-button", "›", () => this.#stepView(1));
            const nextName = labels.next?.(view);
            if (nextName) next.setAttribute("aria-label", nextName);
            nav.appendChild(next);
            toolbar.appendChild(nav);
            root.appendChild(toolbar);
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
        for (let i = 0; i < 7; i++) {
            const weekday = (firstDay + i) % 7;
            const th = document.createElement("th");
            th.className = "calendar-table-th";
            th.setAttribute("scope", "col");
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
                const picked = this.selectedDate === d;
                const range = this.#selectedRange;
                const inRange = !!range && d >= range.start && d <= range.end;
                const dayRanges = this.#ranges.filter((r) => d >= r.start && d <= r.end);
                const td = document.createElement("td");
                td.className = "calendar-table-td";
                td.setAttribute("role", "gridcell");
                const isCursor = d === cursor;
                td.setAttribute("tabindex", isCursor ? "0" : "-1");
                if (isCursor) td.setAttribute("aria-selected", "true");
                if (isToday) td.setAttribute("aria-current", "date");
                td.setAttribute("data-date", d);
                if (outside) td.setAttribute("data-outside-period", "");
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
                td.appendChild(
                    this.renderDay({
                        date: d,
                        events: eventMap.get(d) ?? [],
                        isToday,
                        outsidePeriod: outside,
                        selected: picked,
                        disabled,
                        inRange,
                        ranges: dayRanges,
                        openEvent: (e) => this.#openEvent(e),
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
