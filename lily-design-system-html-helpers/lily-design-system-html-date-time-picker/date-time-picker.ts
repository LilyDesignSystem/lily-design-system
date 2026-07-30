/**
 * `<date-time-picker>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * The control is a text field plus an icon button that opens a WAI-ARIA
 * APG **Date Picker Dialog**: a month grid with a full keyboard contract,
 * optional time selects, optional shortcuts, and a Confirm/Cancel footer.
 *
 * Ported from the canonical Svelte helper
 * `lily-design-system-svelte-date-time-picker`. Svelte wins on
 * behaviour; this file supplies the custom-element idiom. Unlike the
 * three preference helpers (and like `share-picker`) this control does
 * not persist anything to `localStorage`: a date is data, not a
 * preference.
 */

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** What the control collects. */
export type DateTimeMode = "date" | "time" | "datetime";

/**
 * A civil date: no time zone, no instant.
 *
 * The whole component works in these rather than in `Date`, because a
 * `Date` is an instant and a calendar day is not. `new Date(2026, 2, 1)`
 * is midnight *local*, and in a zone whose DST transition falls at
 * midnight that instant can land on the previous day — so a picker built
 * on local-midnight `Date` values shows the wrong day to some users a
 * couple of times a year. Arithmetic here goes through UTC epoch days,
 * which has no such edge.
 */
export type CivilDate = { year: number; month: number; day: number };

/** A wall-clock time, 24-hour, no seconds. */
export type CivilTime = { hour: number; minute: number };

/** One quick-pick button in the dialog. */
export type DateTimeShortcut = {
    /** Stable identifier, passed back on the `shortcut` event. */
    id: string;
    /** Visible button text. Consumer-supplied, so it localises. */
    label: string;
    /** Days from today. Mutually exclusive with `months` and `date`. */
    days?: number;
    /** Calendar months from today. */
    months?: number;
    /** An absolute ISO date, for shortcuts that are not relative. */
    date?: string;
};

/**
 * Every user-facing string the dialog needs.
 *
 * Grouped into one object, property-only, rather than ten flat
 * attributes — see `spec/index.md` §4.3 for why this is not a JSON
 * attribute the way this catalog's other object-valued props are. The
 * four navigation labels and the two footer labels are required: they
 * name buttons that always render, and a button whose accessible name
 * was invented in English is precisely the defect this package exists to
 * avoid. The rest gate optional UI.
 */
export type DateTimePickerLabels = {
    /** Accessible name for the previous-year button. */
    previousYear: string;
    /** Accessible name for the previous-month button. */
    previousMonth: string;
    /** Accessible name for the next-month button. */
    nextMonth: string;
    /** Accessible name for the next-year button. */
    nextYear: string;
    /** Visible text of the commit button. */
    confirm: string;
    /** Visible text of the dismiss button. */
    cancel: string;
    /** Label for the hour select. Required when `mode` includes a time. */
    hour?: string;
    /** Label for the minute select. Required when `mode` includes a time. */
    minute?: string;
    /** Label for the AM/PM select, when `hour12` resolves true. */
    meridiem?: string;
    /** Column heading for week numbers. Required when `showWeekNumbers`. */
    week?: string;
    /** Visible text of the clear button. The button renders only when set. */
    clear?: string;
    /**
     * Message announced when typed text will not parse or is out of
     * range. When set, a `role="status"` live region renders after the
     * field and is wired to it via `aria-errormessage` — without it,
     * `aria-invalid` flips silently and a screen-reader user who has
     * already left the field never hears that their date was refused.
     */
    invalid?: string;
    /**
     * Keyboard help for the dialog, e.g. "Use the arrow keys to choose
     * a date". When set, it renders inside the dialog and becomes the
     * dialog's `aria-describedby`, so a screen reader speaks it once on
     * open — the APG date-picker dialog ships exactly this affordance.
     */
    instructions?: string;
};

/** Detail dispatched on the `datetimechange` CustomEvent. */
export type DateTimePickerChangeDetail = {
    /** The newly committed ISO value. */
    value: string;
};

/** Detail dispatched on the `shortcut` CustomEvent. */
export type DateTimePickerShortcutDetail = {
    /** The shortcut's stable `id`. */
    id: string;
    /** The ISO date the shortcut resolved to. */
    isoDate: string;
};

/** Detail dispatched on the `invalidinput` CustomEvent. */
export type DateTimePickerInvalidDetail = {
    /** The typed text that would not parse (or resolved out of range). */
    text: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type DateTimePickerProps = {
    label: string;
    mode?: DateTimeMode;
    value?: string;
    locale?: string;
    min?: string;
    max?: string;
    firstDayOfWeek?: number;
    minuteStep?: number;
    hour12?: boolean;
    showWeekNumbers?: boolean;
    confirmOnSelect?: boolean;
    name?: string;
    inputId?: string;
    describedBy?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    class?: string;
    /** Property-only: every other user-facing string. See spec §4.3. */
    labels?: DateTimePickerLabels;
    /** Property-only: quick-pick buttons. See spec §4.3. */
    shortcuts?: DateTimeShortcut[];
    /** Property-only: a function cannot be an attribute. */
    isDateDisabled?: (isoDate: string) => boolean;
    /** Property-only: a function cannot be an attribute. */
    formatValue?: (value: string) => string;
    /** Property-only: a function cannot be an attribute. */
    parseInput?: (text: string) => string | null;
    /** Property-only callback; paired with the `datetimechange` event. */
    onChange?: (value: string) => void;
    /** Property-only callback; paired with the `shortcut` event. */
    onShortcut?: (id: string, isoDate: string) => void;
    /** Property-only callback; paired with the `invalidinput` event. */
    onInvalidInput?: (text: string) => void;
};

// -----------------------------------------------------------------------
// Civil-date arithmetic
//
// Pure and total: no local-time `Date` values, no throwing, null for
// "not a date". Exported so a consumer wiring `min`, `max`, `shortcuts`
// or `isDateDisabled` can do their own date maths without reaching for a
// `Date` and reintroducing the local-midnight bug this module exists to
// avoid.
// -----------------------------------------------------------------------

/** Zero-pad to `width`. */
export function pad(n: number, width = 2): string {
    return String(Math.abs(n)).padStart(width, "0");
}

/** Days in a month. `month` is 1-12. */
export function daysInMonth(year: number, month: number): number {
    // Day 0 of the next month is the last day of this one.
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `{2026, 3, 1}` → `"2026-03-01"`. */
export function formatIsoDate(date: CivilDate): string {
    return `${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}

/**
 * `"2026-03-01"` → `{2026, 3, 1}`, or null.
 *
 * Rejects impossible components rather than rolling them over, so
 * `"2026-02-31"` is null and not the 3rd of March.
 */
export function parseIsoDate(text: string): CivilDate | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > daysInMonth(year, month)) return null;
    return { year, month, day };
}

/** Days since the Unix epoch. The unit all date arithmetic goes through. */
export function toEpochDay(date: CivilDate): number {
    return Date.UTC(date.year, date.month - 1, date.day) / 86400000;
}

/** Inverse of `toEpochDay`. */
export function fromEpochDay(epochDay: number): CivilDate {
    const d = new Date(epochDay * 86400000);
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
    };
}

/** Shift an ISO date by whole days. */
export function addDays(isoDate: string, days: number): string {
    const date = parseIsoDate(isoDate);
    if (!date) return isoDate;
    return formatIsoDate(fromEpochDay(toEpochDay(date) + days));
}

/**
 * Shift an ISO date by whole months, clamping the day.
 *
 * 31 January + 1 month is 28 February (29 in a leap year), not 3 March.
 */
export function addMonths(isoDate: string, months: number): string {
    const date = parseIsoDate(isoDate);
    if (!date) return isoDate;
    const total = date.year * 12 + (date.month - 1) + months;
    const year = Math.floor(total / 12);
    const month = (((total % 12) + 12) % 12) + 1;
    return formatIsoDate({
        year,
        month,
        day: Math.min(date.day, daysInMonth(year, month)),
    });
}

/** Day of week: 0 = Sunday … 6 = Saturday. */
export function weekdayOf(isoDate: string): number {
    const date = parseIsoDate(isoDate);
    if (!date) return 0;
    return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/**
 * ISO-8601 week number.
 *
 * Weeks start Monday and week 1 is the one containing the first
 * Thursday, which is why this pivots on Thursday rather than counting
 * from 1 January.
 */
export function isoWeek(isoDate: string): number {
    if (!parseIsoDate(isoDate)) return 0;
    const mondayIndex = (weekdayOf(isoDate) + 6) % 7;
    const thursday = addDays(isoDate, 3 - mondayIndex);
    const parsed = parseIsoDate(thursday);
    if (!parsed) return 0;
    const jan1 = parseIsoDate(formatIsoDate({ year: parsed.year, month: 1, day: 1 }));
    if (!jan1) return 0;
    return Math.floor((toEpochDay(parsed) - toEpochDay(jan1)) / 7) + 1;
}

/** `"09:30"` → `{9, 30}`, or null. */
export function parseIsoTime(text: string): CivilTime | null {
    const m = /^(\d{2}):(\d{2})$/.exec(text.trim());
    if (!m) return null;
    const hour = Number(m[1]);
    const minute = Number(m[2]);
    if (hour > 23 || minute > 59) return null;
    return { hour, minute };
}

/** `{9, 30}` → `"09:30"`. */
export function formatIsoTime(time: CivilTime): string {
    return `${pad(time.hour)}:${pad(time.minute)}`;
}

/** Pull the date and time halves out of a mode-appropriate ISO value. */
export function splitValue(
    value: string,
    mode: DateTimeMode,
): { date: string; time: string } {
    if (!value) return { date: "", time: "" };
    if (mode === "time") {
        return { date: "", time: parseIsoTime(value) ? value : "" };
    }
    const [datePart = "", timePart = ""] = value.split("T");
    return {
        date: parseIsoDate(datePart) ? datePart : "",
        time: mode === "datetime" && parseIsoTime(timePart) ? timePart : "",
    };
}

/** Recombine the halves. Returns "" when the value is incomplete. */
export function joinValue(date: string, time: string, mode: DateTimeMode): string {
    if (mode === "date") return date;
    if (mode === "time") return time;
    return date && time ? `${date}T${time}` : "";
}

/** Is `isoDate` inside the inclusive [min, max] window? Empty bounds pass. */
export function withinRange(isoDate: string, min?: string, max?: string): boolean {
    if (min && isoDate < min) return false;
    if (max && isoDate > max) return false;
    return true;
}

/** Uppercase region subtag of a BCP 47 tag, or "". */
function regionOf(locale?: string): string {
    if (!locale) return "";
    for (const part of locale.split(/[-_]/).slice(1)) {
        if (/^[A-Za-z]{2}$/.test(part)) return part.toUpperCase();
    }
    return "";
}

const SUNDAY_FIRST_REGIONS = new Set([
    "AR", "BR", "CA", "CL", "CO", "DO", "GT", "HK", "IL", "IN", "JP",
    "KR", "MO", "MX", "PE", "PH", "PK", "TH", "TW", "US", "VE", "ZA",
]);

const SATURDAY_FIRST_REGIONS = new Set([
    "AE", "AF", "BH", "DJ", "DZ", "EG", "IQ", "IR", "JO", "KW", "LY",
    "OM", "QA", "SA", "SD", "SY", "YE",
]);

/**
 * First day of the week for a locale: 0 = Sunday … 6 = Saturday.
 *
 * `Intl.Locale.prototype.getWeekInfo` is the right answer, but it is
 * recent enough that a fallback still earns its place. The fallback is a
 * short region table plus a Monday default, Monday being both the
 * ISO-8601 rule and the majority convention worldwide.
 */
export function firstDayOfWeekFor(locale?: string): number {
    if (locale) {
        try {
            const loc = new Intl.Locale(locale) as Intl.Locale & {
                getWeekInfo?: () => { firstDay: number };
                weekInfo?: { firstDay: number };
            };
            const info = loc.getWeekInfo?.() ?? loc.weekInfo;
            // getWeekInfo reports 1 = Monday … 7 = Sunday, so Sunday (7)
            // has to fold to 0.
            if (info && typeof info.firstDay === "number") return info.firstDay % 7;
        } catch {
            // Malformed tag — fall through to the table.
        }
    }
    const region = regionOf(locale);
    if (SUNDAY_FIRST_REGIONS.has(region)) return 0;
    if (SATURDAY_FIRST_REGIONS.has(region)) return 6;
    return 1;
}

/**
 * The dates of one month's grid, always six rows of seven.
 *
 * Fixed height on purpose — see `spec/index.md` §3.
 */
export function monthMatrix(
    year: number,
    month: number,
    firstDayOfWeek: number,
): string[][] {
    const first = formatIsoDate({ year, month, day: 1 });
    const lead = (weekdayOf(first) - firstDayOfWeek + 7) % 7;
    const start = addDays(first, -lead);
    const weeks: string[][] = [];
    for (let row = 0; row < 6; row++) {
        const week: string[] = [];
        for (let col = 0; col < 7; col++) week.push(addDays(start, row * 7 + col));
        weeks.push(week);
    }
    return weeks;
}

/** Long and short month names for a locale, index 0 = January. */
export function monthNames(locale?: string): { long: string[]; short: string[] } {
    const build = (month: "long" | "short") => {
        try {
            const fmt = new Intl.DateTimeFormat(locale, { month, timeZone: "UTC" });
            return Array.from({ length: 12 }, (_, i) =>
                fmt.format(new Date(Date.UTC(2021, i, 15))),
            );
        } catch {
            return [];
        }
    };
    return { long: build("long"), short: build("short") };
}

/** Match a token against a locale's month names. Returns 1-12, or 0. */
function matchMonthName(token: string, names: { long: string[]; short: string[] }): number {
    const norm = (s: string) => s.toLocaleLowerCase().replace(/\.$/, "").normalize("NFKD");
    const t = norm(token);
    if (!t || /^\d+$/.test(t)) return 0;
    for (let i = 0; i < 12; i++) {
        if (norm(names.long[i] ?? "") === t) return i + 1;
        if (norm(names.short[i] ?? "") === t) return i + 1;
    }
    // Prefix match, so "Sept" finds September. Three characters minimum:
    // "Ma" cannot choose between March and May.
    if (t.length >= 3) {
        for (let i = 0; i < 12; i++) {
            const long = norm(names.long[i] ?? "");
            if (long && long.startsWith(t)) return i + 1;
        }
    }
    return 0;
}

/**
 * The order a locale writes a numeric date in — `["day","month","year"]`
 * for en-GB, `["month","day","year"]` for en-US.
 */
export function numericFieldOrder(locale?: string): ("day" | "month" | "year")[] {
    try {
        const parts = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
        }).formatToParts(new Date(Date.UTC(2021, 4, 6)));
        const order = parts
            .map((p) => p.type)
            .filter((t): t is "day" | "month" | "year" => t === "day" || t === "month" || t === "year");
        if (order.length === 3) return order;
    } catch {
        // Fall through.
    }
    return ["day", "month", "year"];
}

/**
 * Parse typed text into an ISO date.
 *
 * Accepts, in order: ISO `YYYY-MM-DD`; a numeric form whose field order
 * follows the locale; and a form with a written month matched against
 * the locale's own long and short month names. Anything else is null.
 */
export function parseDateInput(text: string, locale?: string): string | null {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const iso = parseIsoDate(trimmed);
    if (iso) return formatIsoDate(iso);

    const parts = trimmed.split(/[\s./-]+/).filter(Boolean);
    if (parts.length !== 3) return null;

    const names = monthNames(locale);
    let month = 0;
    let monthIndex = -1;
    for (let i = 0; i < parts.length; i++) {
        const found = matchMonthName(parts[i], names);
        if (found) {
            month = found;
            monthIndex = i;
            break;
        }
    }

    let day = 0;
    let year = 0;

    if (monthIndex >= 0) {
        const rest = parts.filter((_, i) => i !== monthIndex).map((p) => Number(p));
        if (rest.some((n) => Number.isNaN(n))) return null;
        [day, year] = rest[0] > rest[1] ? [rest[1], rest[0]] : rest;
    } else {
        const nums = parts.map((p) => Number(p));
        if (nums.some((n) => Number.isNaN(n))) return null;
        const order = numericFieldOrder(locale);
        year = nums[order.indexOf("year")];
        day = nums[order.indexOf("day")];
        month = nums[order.indexOf("month")];
    }

    // Two-digit years: the usual 70 pivot.
    if (year < 100) year += year < 70 ? 2000 : 1900;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > daysInMonth(year, month)) return null;
    return formatIsoDate({ year, month, day });
}

/** Accepts `9:30`, `09:30`, `0930`, `9.30`, and a trailing am/pm. */
export function parseTimeInput(text: string): string | null {
    const m = /^(\d{1,2})[:.]?(\d{2})\s*([ap])\.?m\.?$|^(\d{1,2})[:.]?(\d{2})$/.exec(
        text.trim().toLowerCase(),
    );
    if (!m) return null;
    let hour = Number(m[1] ?? m[4]);
    const minute = Number(m[2] ?? m[5]);
    const meridiem = m[3];
    if (meridiem === "p" && hour < 12) hour += 12;
    if (meridiem === "a" && hour === 12) hour = 0;
    if (hour > 23 || minute > 59) return null;
    return formatIsoTime({ hour, minute });
}

/** Does this locale write times on a 12-hour clock? */
function localeUsesHour12(locale?: string): boolean {
    try {
        const parts = new Intl.DateTimeFormat(locale, {
            hour: "numeric",
            timeZone: "UTC",
        }).formatToParts(new Date(Date.UTC(2021, 0, 1, 13)));
        return parts.some((p) => p.type === "dayPeriod");
    } catch {
        return false;
    }
}

/** The locale's own AM / PM strings, so neither is hardcoded. */
function dayPeriodName(locale: string | undefined, pm: boolean): string {
    try {
        const parts = new Intl.DateTimeFormat(locale, {
            hour: "numeric",
            hour12: true,
            timeZone: "UTC",
        }).formatToParts(new Date(Date.UTC(2021, 0, 1, pm ? 13 : 1)));
        const found = parts.find((p) => p.type === "dayPeriod")?.value;
        if (found) return found;
    } catch {
        // Fall through.
    }
    return pm ? "PM" : "AM";
}

/** The host's current calendar day, read through the local getters. */
function todayIso(): string {
    const now = new Date();
    return formatIsoDate({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    });
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextDateTimePickerId(): string {
    uid += 1;
    return `date-time-picker-${uid}`;
}

/**
 * Default button glyph: U+1F4C5 CALENDAR, followed by U+FE0E VARIATION
 * SELECTOR-15 to request text (monochrome) presentation.
 *
 * Written as an escape, never as a bare character: a variation selector
 * has no visual form at all, so a bare one is invisible in an editor and
 * trivially lost to a careless edit. `bin/test` at the form-examples repo
 * root scans this catalog for bare glyph characters and fails the build
 * if it finds one — this constant, and the icon markup that uses it, are
 * both escapes.
 */
export const CALENDAR = "\u{1F4C5}\uFE0E";

const DEFAULT_LABELS: DateTimePickerLabels = {
    previousYear: "",
    previousMonth: "",
    nextMonth: "",
    nextYear: "",
    confirm: "",
    cancel: "",
};

// -----------------------------------------------------------------------
// Custom element
// -----------------------------------------------------------------------

/** Custom-element class implementing `<date-time-picker>`. */
export class DateTimePicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "mode",
            "value",
            "locale",
            "min",
            "max",
            "first-day-of-week",
            "minute-step",
            "hour12",
            "show-week-numbers",
            "confirm-on-select",
            "name",
            "input-id",
            "described-by",
            "placeholder",
            "disabled",
            "readonly",
            "required",
            "class",
        ];
    }

    // ---- Backing storage for property-only members ----
    #labels: DateTimePickerLabels = DEFAULT_LABELS;
    #shortcuts: DateTimeShortcut[] = [];
    #isDateDisabled?: (isoDate: string) => boolean;
    #formatValue?: (value: string) => string;
    #parseInput?: (text: string) => string | null;

    /** Fires after a value is committed. Mirrored by `datetimechange`. */
    onChange?: (value: string) => void;
    /** Fires when a shortcut is used. Mirrored by `shortcut`. */
    onShortcut?: (id: string, isoDate: string) => void;
    /** Fires when typed text will not parse. Mirrored by `invalidinput`. */
    onInvalidInput?: (text: string) => void;

    // ---- Internal state, all private ----
    #open = false;
    #invalid = false;
    #typed: string | null = null;
    #pendingDate = "";
    #pendingTime = "";
    #viewYear = 1970;
    #viewMonth = 1;
    #cursor = "";
    #today = "";
    #initialised = false;

    readonly #baseId = nextDateTimePickerId();

    // ---- Rendered-DOM references. Null until #render() has run. ----
    #rootEl: HTMLDivElement | null = null;
    #fieldEl: HTMLInputElement | null = null;
    #buttonEl: HTMLButtonElement | null = null;
    #dialogEl: HTMLDivElement | null = null;
    #hiddenEl: HTMLInputElement | null = null;
    #statusEl: HTMLSpanElement | null = null;
    #periodEl: HTMLSpanElement | null = null;
    #tableEl: HTMLTableElement | null = null;
    #weekdayThs: HTMLTableCellElement[] = [];
    #weekHeadingTh: HTMLTableCellElement | null = null;
    #weekThs: HTMLTableCellElement[] = [];
    #dayCells: { td: HTMLTableCellElement; button: HTMLButtonElement }[] = [];
    #hourSelect: HTMLSelectElement | null = null;
    #minuteSelect: HTMLSelectElement | null = null;
    #meridiemSelect: HTMLSelectElement | null = null;

    /**
     * The element that opened the dialog, so close can return focus to
     * it.
     *
     * The APG rule is "focus returns to the element that invoked the
     * dialog" — which is the trigger button on a click, but the *text
     * field* when the user pressed Alt+ArrowDown. Always refocusing the
     * button strands a keyboard user one Tab stop past where they were.
     */
    #openerEl: HTMLElement | null = null;

    #onDocumentClick = (event: MouseEvent): void => {
        if (!this.#open) return;
        const t = event.target as Node | null;
        if (!t) return;
        // Anything outside the dialog closes it — including the
        // component's own text field. The dialog says aria-modal="true",
        // and a modal that stays open while the user edits the field
        // behind it is telling assistive technology one thing and doing
        // another. The trigger button is exempt because its own handler
        // already toggles.
        if (this.#dialogEl?.contains(t) || this.#buttonEl?.contains(t)) return;
        this.#closeDialog(false);
    };

    // ---- Property accessors (attribute mirrors) ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        if (v) this.setAttribute("label", v);
        else this.removeAttribute("label");
    }

    get mode(): DateTimeMode {
        const v = this.getAttribute("mode");
        return v === "time" || v === "datetime" ? v : "date";
    }
    set mode(v: DateTimeMode) {
        this.setAttribute("mode", v);
    }

    get value(): string {
        return this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        if (v) this.setAttribute("value", v);
        else this.removeAttribute("value");
    }

    get locale(): string | undefined {
        return this.getAttribute("locale") ?? undefined;
    }
    set locale(v: string | undefined) {
        if (v) this.setAttribute("locale", v);
        else this.removeAttribute("locale");
    }

    get min(): string | undefined {
        return this.getAttribute("min") ?? undefined;
    }
    set min(v: string | undefined) {
        if (v) this.setAttribute("min", v);
        else this.removeAttribute("min");
    }

    get max(): string | undefined {
        return this.getAttribute("max") ?? undefined;
    }
    set max(v: string | undefined) {
        if (v) this.setAttribute("max", v);
        else this.removeAttribute("max");
    }

    /**
     * 0 = Sunday … 6 = Saturday. Absent falls back to the locale's own
     * convention (`firstDayOfWeekFor`), exactly as the Svelte original.
     */
    get firstDayOfWeek(): number {
        const v = this.getAttribute("first-day-of-week");
        if (v !== null && v !== "") {
            const n = Number(v);
            if (Number.isInteger(n) && n >= 0 && n <= 6) return n;
        }
        return firstDayOfWeekFor(this.locale);
    }
    set firstDayOfWeek(v: number | undefined) {
        if (v === undefined) this.removeAttribute("first-day-of-week");
        else this.setAttribute("first-day-of-week", String(v));
    }

    get minuteStep(): number {
        const v = Number(this.getAttribute("minute-step"));
        return Number.isFinite(v) && v > 0 ? v : 1;
    }
    set minuteStep(v: number) {
        this.setAttribute("minute-step", String(v));
    }

    /**
     * 12-hour clock. Absent falls back to the locale's own convention.
     * Tri-state via the attribute value: absent → auto, `"true"` /
     * `"false"` → explicit.
     */
    get hour12(): boolean {
        const v = this.getAttribute("hour12");
        if (v === "true") return true;
        if (v === "false") return false;
        return localeUsesHour12(this.locale);
    }
    set hour12(v: boolean | undefined) {
        if (v === undefined) this.removeAttribute("hour12");
        else this.setAttribute("hour12", String(v));
    }

    /** Standard boolean-attribute convention: absent → false. */
    get showWeekNumbers(): boolean {
        const v = this.getAttribute("show-week-numbers");
        return v !== null && v !== "false";
    }
    set showWeekNumbers(v: boolean) {
        if (v) this.setAttribute("show-week-numbers", "");
        else this.removeAttribute("show-week-numbers");
    }

    /**
     * Commit and close as soon as a day is chosen. Absent defaults to
     * `mode === "date"`, matching the Svelte original.
     */
    get confirmOnSelect(): boolean {
        const v = this.getAttribute("confirm-on-select");
        if (v === "true") return true;
        if (v === "false") return false;
        return this.mode === "date";
    }
    set confirmOnSelect(v: boolean | undefined) {
        if (v === undefined) this.removeAttribute("confirm-on-select");
        else this.setAttribute("confirm-on-select", String(v));
    }

    get name(): string {
        return this.getAttribute("name") ?? "date-time";
    }
    set name(v: string) {
        if (v) this.setAttribute("name", v);
        else this.removeAttribute("name");
    }

    get inputId(): string {
        return this.getAttribute("input-id") || `${this.#baseId}-input`;
    }
    set inputId(v: string) {
        if (v) this.setAttribute("input-id", v);
        else this.removeAttribute("input-id");
    }

    get describedBy(): string | undefined {
        return this.getAttribute("described-by") ?? undefined;
    }
    set describedBy(v: string | undefined) {
        if (v) this.setAttribute("described-by", v);
        else this.removeAttribute("described-by");
    }

    get placeholder(): string | undefined {
        return this.getAttribute("placeholder") ?? undefined;
    }
    set placeholder(v: string | undefined) {
        if (v) this.setAttribute("placeholder", v);
        else this.removeAttribute("placeholder");
    }

    get disabled(): boolean {
        const v = this.getAttribute("disabled");
        return v !== null && v !== "false";
    }
    set disabled(v: boolean) {
        if (v) this.setAttribute("disabled", "");
        else this.removeAttribute("disabled");
    }

    get readonly(): boolean {
        const v = this.getAttribute("readonly");
        return v !== null && v !== "false";
    }
    set readonly(v: boolean) {
        if (v) this.setAttribute("readonly", "");
        else this.removeAttribute("readonly");
    }

    get required(): boolean {
        const v = this.getAttribute("required");
        return v !== null && v !== "false";
    }
    set required(v: boolean) {
        if (v) this.setAttribute("required", "");
        else this.removeAttribute("required");
    }

    // ---- Property-only members (functions / objects / arrays) ----

    /**
     * Every user-facing string beyond `label`.
     *
     * Property-only, like `share-picker`'s `targets`: this catalog
     * usually JSON-encodes object attributes, but `labels` groups
     * naturally with the function-valued members below (it is one
     * settings bundle handed to the control at setup time, not a value a
     * consumer expects to drive from server-rendered markup), and a
     * JSON round-trip risks silently dropping an optional key. See
     * `spec/index.md` §4.3.
     */
    get labels(): DateTimePickerLabels {
        return this.#labels;
    }
    set labels(v: DateTimePickerLabels) {
        this.#labels = v ?? DEFAULT_LABELS;
        this.#render();
    }

    /** Quick-pick buttons. Property-only: see `spec/index.md` §4.3. */
    get shortcuts(): DateTimeShortcut[] {
        return [...this.#shortcuts];
    }
    set shortcuts(v: DateTimeShortcut[]) {
        this.#shortcuts = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    /** Veto individual dates. Property-only: a function cannot be an attribute. */
    get isDateDisabled(): ((isoDate: string) => boolean) | undefined {
        return this.#isDateDisabled;
    }
    set isDateDisabled(fn: ((isoDate: string) => boolean) | undefined) {
        this.#isDateDisabled = fn;
        this.#syncState();
    }

    /** Override field rendering. Property-only: a function cannot be an attribute. */
    get formatValue(): ((value: string) => string) | undefined {
        return this.#formatValue;
    }
    set formatValue(fn: ((value: string) => string) | undefined) {
        this.#formatValue = fn;
        this.#syncState();
    }

    /** Override typed-text parsing. Property-only: a function cannot be an attribute. */
    get parseInput(): ((text: string) => string | null) | undefined {
        return this.#parseInput;
    }
    set parseInput(fn: ((text: string) => string | null) | undefined) {
        this.#parseInput = fn;
    }

    // ---- Read-only getters ----

    /** Is the dialog open? */
    get open(): boolean {
        return this.#open;
    }

    /** id of the rendered dialog `<div role="dialog">`. */
    get dialogId(): string {
        return `${this.#baseId}-dialog`;
    }

    /** id of the rendered text `<input>`. */
    get fieldId(): string {
        return this.inputId;
    }

    get #periodId(): string {
        return `${this.#baseId}-period`;
    }
    get #hourId(): string {
        return `${this.#baseId}-hour`;
    }
    get #minuteId(): string {
        return `${this.#baseId}-minute`;
    }
    get #meridiemId(): string {
        return `${this.#baseId}-meridiem`;
    }
    get #statusId(): string {
        return `${this.#baseId}-status`;
    }
    get #instructionsId(): string {
        return `${this.#baseId}-instructions`;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of the trigger button. The default is the
     * calendar glyph wrapped in `aria-hidden="true"`, so the accessible
     * name comes from the button's `aria-label` alone.
     *
     * This is the HTML-helper equivalent of the Svelte `children`
     * snippet. Light DOM has no `<slot>`, so subclassing is the
     * customisation surface, matching `share-picker`'s
     * `renderButtonContent()`. Re-runs on every `#syncState()`, so a
     * subclass reading `this.open` / `this.value` stays current.
     */
    renderButtonContent(): Node {
        const icon = document.createElement("span");
        icon.className = "date-time-picker-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = CALENDAR;
        return icon;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        if (!this.#initialised) {
            this.#initialised = true;
            this.#today = todayIso();
            const anchor =
                parseIsoDate(splitValue(this.value, this.mode).date) ??
                parseIsoDate(this.#today);
            if (anchor) {
                this.#viewYear = anchor.year;
                this.#viewMonth = anchor.month;
                this.#cursor = formatIsoDate(anchor);
            }
        }
        this.#render();
        document.addEventListener("click", this.#onDocumentClick);
    }

    attributeChangedCallback(name: string, _old: string | null, _value: string | null): void {
        switch (name) {
            // Structural: these change which elements exist (the grid,
            // the time selects, the week column) or invalidate every
            // cached label/name in the dialog, so the subtree rebuilds.
            // A rebuild closes the dialog first (see #render), which is
            // an acceptable cost for props a consumer sets at setup
            // time, not mid-interaction.
            case "mode":
            case "show-week-numbers":
            case "hour12":
            case "locale":
            case "first-day-of-week":
                this.#render();
                break;
            // Everything else is non-structural: attribute values change
            // on elements that already exist. #syncState() never creates
            // or destroys a node, so this never destroys focus inside an
            // open dialog.
            default:
                this.#syncState();
                break;
        }
    }

    disconnectedCallback(): void {
        document.removeEventListener("click", this.#onDocumentClick);
    }

    // ---- Open / close (public) ----

    /** Open the dialog, seeding pending state from the committed value. */
    openDialog(): void {
        if (this.disabled || this.readonly) return;
        const active = document.activeElement;
        this.#openerEl =
            active instanceof HTMLElement && this.#rootEl?.contains(active)
                ? active
                : this.#buttonEl;
        this.#today = todayIso();
        const committed = splitValue(this.value, this.mode);
        this.#pendingDate = committed.date || this.#nearestSelectable(this.#today);
        this.#pendingTime = committed.time || this.#defaultTime();
        this.#cursor = this.#pendingDate;
        const anchor = parseIsoDate(this.#pendingDate) ?? parseIsoDate(this.#today);
        if (anchor) {
            this.#viewYear = anchor.year;
            this.#viewMonth = anchor.month;
        }
        this.#open = true;
        this.#syncState();
        queueMicrotask(() => this.#focusInitial());
    }

    /** Close the dialog. `value` is untouched unless `#commit()` ran first. */
    closeDialog(refocus = true): void {
        this.#closeDialog(refocus);
    }

    #closeDialog(refocus = true): void {
        if (!this.#open) return;
        this.#open = false;
        this.#syncState();
        if (refocus) {
            // Back to whichever element opened the dialog — the trigger
            // button after a click, the text field after Alt+ArrowDown.
            // Guard the method, not only the element (jsdom precedent).
            const target = this.#openerEl ?? this.#buttonEl;
            queueMicrotask(() => target?.focus?.());
        }
    }

    // ---- Selectability ----

    #dayDisabled(isoDate: string): boolean {
        if (!withinRange(isoDate, this.min, this.max)) return true;
        return this.#isDateDisabled?.(isoDate) === true;
    }

    /** The nearest selectable day to `isoDate`, searching outwards. */
    #nearestSelectable(isoDate: string): string {
        if (!this.#dayDisabled(isoDate)) return isoDate;
        // Bounded: a year either way is far beyond any real min/max
        // window, and an unbounded search would hang on a predicate that
        // disables everything.
        for (let delta = 1; delta <= 366; delta++) {
            const after = addDays(isoDate, delta);
            if (!this.#dayDisabled(after)) return after;
            const before = addDays(isoDate, -delta);
            if (!this.#dayDisabled(before)) return before;
        }
        return isoDate;
    }

    #usesDate(): boolean {
        return this.mode !== "time";
    }
    #usesTime(): boolean {
        return this.mode !== "date";
    }

    /** Where an unset time starts: now, snapped down to the step. */
    #defaultTime(): string {
        if (!this.#usesTime()) return "";
        const now = new Date();
        const step = Math.max(1, this.minuteStep);
        return formatIsoTime({
            hour: now.getHours(),
            minute: Math.floor(now.getMinutes() / step) * step,
        });
    }

    /** Focus the grid cursor, or the first control when there is no grid. */
    #focusInitial(): void {
        if (this.#usesDate()) {
            this.#focusCursor();
            return;
        }
        this.#focusables()[0]?.focus();
    }

    // ---- Commit / clear / typed-text resolution ----

    #commitValue(next: string): void {
        if (next === this.value) return;
        this.value = next;
        this.onChange?.(next);
        this.dispatchEvent(
            new CustomEvent<DateTimePickerChangeDetail>("datetimechange", {
                detail: { value: next },
                bubbles: true,
                composed: true,
            }),
        );
    }

    /** Commit the pending selection to `value` and notify. */
    #commit(): void {
        const next = joinValue(this.#pendingDate, this.#pendingTime, this.mode);
        // An incomplete datetime is not committed. Half a timestamp is
        // not a smaller truth; it is a different one.
        if (!next) return;
        this.#typed = null;
        this.#invalid = false;
        this.#commitValue(next);
        this.#closeDialog();
    }

    #clear(): void {
        this.#typed = null;
        this.#invalid = false;
        this.#commitValue("");
        this.#closeDialog();
    }

    // ---- Grid navigation ----

    /**
     * Move the cursor, paging the view when the target is off-screen.
     *
     * Vetoed days are still reachable — the cursor lands on them, the
     * button is `aria-disabled` rather than `disabled` so it takes real
     * focus, and arrowing across a blocked range works. What is refused
     * is leaving the min/max window entirely.
     */
    #moveCursor(nextIso: string): void {
        if (!withinRange(nextIso, this.min, this.max)) return;
        this.#cursor = nextIso;
        const parsed = parseIsoDate(nextIso);
        if (parsed && (parsed.year !== this.#viewYear || parsed.month !== this.#viewMonth)) {
            this.#viewYear = parsed.year;
            this.#viewMonth = parsed.month;
        }
        this.#syncState();
        queueMicrotask(() => this.#focusCursor());
    }

    #focusCursor(): void {
        if (!this.#dialogEl || !this.#cursor) return;
        // An attribute selector, not `#id`: the id is not on this
        // element, and a value we generated as `YYYY-MM-DD` needs no
        // escaping.
        const el = this.#dialogEl.querySelector<HTMLElement>(`[data-date="${this.#cursor}"]`);
        // Guard the methods, not only the element: jsdom implements no
        // `scrollIntoView`, and an unguarded call throws from inside a
        // keydown handler.
        el?.focus?.();
        el?.scrollIntoView?.({ block: "nearest" });
    }

    #selectDay(isoDate: string): void {
        if (this.#dayDisabled(isoDate)) return;
        this.#pendingDate = isoDate;
        this.#cursor = isoDate;
        if (this.confirmOnSelect) this.#commit();
        else this.#syncState();
    }

    #shiftMonth(delta: number): void {
        const anchor = formatIsoDate({ year: this.#viewYear, month: this.#viewMonth, day: 1 });
        const next = parseIsoDate(addMonths(anchor, delta));
        if (!next) return;
        // Refocus the cursor only when focus is already in the grid:
        // grid paging (PageUp/PageDown, or a browser that focused
        // nothing on click) must carry focus, or it dies with the
        // unrendered cell — but a header button must keep focus, or its
        // user is yanked into the grid after one activation and cannot
        // page twice.
        const hadGridFocus = this.#tableEl?.contains(document.activeElement) === true;
        this.#viewYear = next.year;
        this.#viewMonth = next.month;
        // Carry the cursor into the new month rather than leaving the
        // roving tabindex on a cell that is no longer rendered.
        const c = parseIsoDate(this.#cursor);
        if (c) {
            this.#cursor = formatIsoDate({
                year: next.year,
                month: next.month,
                day: Math.min(c.day, daysInMonth(next.year, next.month)),
            });
        }
        this.#syncState();
        if (c && hadGridFocus) queueMicrotask(() => this.#focusCursor());
    }

    #shiftYear(delta: number): void {
        this.#shiftMonth(delta * 12);
    }

    #onGridKeydown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "ArrowLeft":
                event.preventDefault();
                this.#moveCursor(addDays(this.#cursor, -1));
                break;
            case "ArrowRight":
                event.preventDefault();
                this.#moveCursor(addDays(this.#cursor, 1));
                break;
            case "ArrowUp":
                event.preventDefault();
                this.#moveCursor(addDays(this.#cursor, -7));
                break;
            case "ArrowDown":
                event.preventDefault();
                this.#moveCursor(addDays(this.#cursor, 7));
                break;
            case "Home": {
                event.preventDefault();
                const offset = (weekdayOf(this.#cursor) - this.firstDayOfWeek + 7) % 7;
                this.#moveCursor(addDays(this.#cursor, -offset));
                break;
            }
            case "End": {
                event.preventDefault();
                const offset = (weekdayOf(this.#cursor) - this.firstDayOfWeek + 7) % 7;
                this.#moveCursor(addDays(this.#cursor, 6 - offset));
                break;
            }
            case "PageUp":
                event.preventDefault();
                if (event.shiftKey) this.#shiftYear(-1);
                else this.#shiftMonth(-1);
                break;
            case "PageDown":
                event.preventDefault();
                if (event.shiftKey) this.#shiftYear(1);
                else this.#shiftMonth(1);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                this.#selectDay(this.#cursor);
                break;
        }
    };

    // ---- Dialog keys and the focus trap ----

    /** Everything tabbable inside the dialog, in DOM order. */
    #focusables(): HTMLElement[] {
        if (!this.#dialogEl) return [];
        return Array.from(
            this.#dialogEl.querySelectorAll<HTMLElement>(
                'button:not([disabled]):not([tabindex="-1"]), select:not([disabled])',
            ),
        );
    }

    #onDialogKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            event.preventDefault();
            // Escape discards: `value` is untouched.
            this.#closeDialog();
            return;
        }
        if (event.key !== "Tab") return;

        // The trap. `aria-modal="true"` is a promise the browser does
        // not keep for us: an untrapped aria-modal dialog tells a screen
        // reader the rest of the page is inert while Tab quietly walks
        // into it.
        const all = this.#focusables();
        if (all.length === 0) return;
        const first = all[0];
        const last = all[all.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey && (active === first || !this.#dialogEl?.contains(active))) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };

    // ---- Text field ----

    /** Default text parsing, per mode. */
    #parseTypedForMode(text: string): string | null {
        if (this.mode === "time") return parseTimeInput(text);
        if (this.mode === "date") return parseDateInput(text, this.locale);
        // datetime: split on the last whitespace run or a literal T, and
        // require both halves.
        const m = /^(.*?)[T\s]+([^\sT]+)$/.exec(text.trim());
        if (!m) return null;
        const date = parseDateInput(m[1], this.locale);
        const time = parseTimeInput(m[2]);
        return date && time ? `${date}T${time}` : null;
    }

    /** Resolve typed text on blur or Enter. */
    #resolveTyped(): void {
        if (this.#typed === null) return;
        const text = this.#typed;
        try {
            if (!text.trim()) {
                this.#typed = null;
                this.#invalid = false;
                this.#commitValue("");
                return;
            }

            const parsed = this.#parseInput ? this.#parseInput(text) : this.#parseTypedForMode(text);
            const parsedDate = parsed ? splitValue(parsed, this.mode).date : "";
            const outOfBounds =
                parsed !== null && this.#usesDate() && parsedDate !== "" && this.#dayDisabled(parsedDate);

            if (!parsed || outOfBounds) {
                // Parseable-but-out-of-bounds gets the same outcome as
                // unparseable: the text stays put, marked invalid, rather
                // than being silently snapped to a nearby legal date the
                // user never typed.
                this.#invalid = true;
                this.onInvalidInput?.(text);
                this.dispatchEvent(
                    new CustomEvent<DateTimePickerInvalidDetail>("invalidinput", {
                        detail: { text },
                        bubbles: true,
                        composed: true,
                    }),
                );
                return;
            }

            this.#typed = null;
            this.#invalid = false;
            this.#commitValue(parsed);
        } finally {
            this.#syncState();
        }
    }

    #onFieldInput = (event: Event): void => {
        this.#typed = (event.currentTarget as HTMLInputElement).value;
    };

    #onFieldBlur = (): void => {
        this.#resolveTyped();
    };

    #onFieldKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.#resolveTyped();
        } else if (event.key === "ArrowDown" && event.altKey) {
            // The platform convention for "open the picker" from a
            // field, matching <input type="date"> in every major
            // browser.
            event.preventDefault();
            this.openDialog();
        } else if (event.key === "Escape" && this.#typed !== null) {
            // Discard the pending edit and show the committed value
            // again — the same contract Escape has inside the dialog.
            // Stops propagating so a surrounding dialog does not also
            // close on what was, to the user, a text-editing keystroke.
            // When no edit is pending the key is left alone.
            event.preventDefault();
            event.stopPropagation();
            this.#typed = null;
            this.#invalid = false;
            this.#syncState();
        }
    };

    // ---- Time selects ----

    #hourOptions(): { value: number; label: string }[] {
        const clock12 = this.hour12;
        const pendingHour = parseIsoTime(this.#pendingTime)?.hour ?? 0;
        const out: { value: number; label: string }[] = [];
        for (let h = 0; h < 24; h++) {
            if (clock12 && h < 12 !== pendingHour < 12) continue;
            out.push({ value: h, label: clock12 ? String(((h + 11) % 12) + 1) : pad(h) });
        }
        return out;
    }

    #minuteOptions(): number[] {
        const out: number[] = [];
        for (let m = 0; m < 60; m += Math.max(1, this.minuteStep)) out.push(m);
        return out;
    }

    #setHour(hour: number): void {
        const minute = parseIsoTime(this.#pendingTime)?.minute ?? 0;
        this.#pendingTime = formatIsoTime({ hour, minute });
        this.#syncState();
    }

    #setMinute(minute: number): void {
        const hour = parseIsoTime(this.#pendingTime)?.hour ?? 0;
        this.#pendingTime = formatIsoTime({ hour, minute });
        this.#syncState();
    }

    /** Cross between AM and PM without changing the minute of the hour. */
    #setMeridiem(pm: boolean): void {
        const hour = parseIsoTime(this.#pendingTime)?.hour ?? 0;
        this.#setHour((hour % 12) + (pm ? 12 : 0));
    }

    // ---- Shortcuts ----

    #applyShortcut(shortcut: DateTimeShortcut): void {
        const base = todayIso();
        let target = shortcut.date ?? base;
        if (shortcut.days !== undefined) target = addDays(base, shortcut.days);
        else if (shortcut.months !== undefined) target = addMonths(base, shortcut.months);
        // A shortcut to a blocked date does nothing rather than landing
        // somewhere near it.
        if (this.#dayDisabled(target)) return;

        this.#pendingDate = target;
        this.#cursor = target;
        const parsed = parseIsoDate(target);
        if (parsed) {
            this.#viewYear = parsed.year;
            this.#viewMonth = parsed.month;
        }
        this.onShortcut?.(shortcut.id, target);
        this.dispatchEvent(
            new CustomEvent<DateTimePickerShortcutDetail>("shortcut", {
                detail: { id: shortcut.id, isoDate: target },
                bubbles: true,
                composed: true,
            }),
        );
        if (this.confirmOnSelect) this.#commit();
        else {
            this.#syncState();
            queueMicrotask(() => this.#focusCursor());
        }
    }

    // ---- Formatting ----

    #formatTimeForDisplay(isoTime: string): string {
        const parsed = parseIsoTime(isoTime);
        if (!parsed) return isoTime;
        try {
            return new Intl.DateTimeFormat(this.locale, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: this.hour12,
                timeZone: "UTC",
            }).format(new Date(Date.UTC(2021, 0, 1, parsed.hour, parsed.minute)));
        } catch {
            return isoTime;
        }
    }

    /** Render an ISO value the way this locale writes it. */
    #defaultFormat(isoValue: string): string {
        if (!isoValue) return "";
        const { date, time } = splitValue(isoValue, this.mode);
        const chunks: string[] = [];
        const parsed = date ? parseIsoDate(date) : null;
        if (parsed) {
            try {
                chunks.push(
                    new Intl.DateTimeFormat(this.locale, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                    }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day))),
                );
            } catch {
                chunks.push(date);
            }
        }
        if (time) chunks.push(this.#formatTimeForDisplay(time));
        return chunks.join(" ");
    }

    /** The text shown in the field. A pending edit wins until resolved. */
    #displayValue(): string {
        if (this.#typed !== null) return this.#typed;
        const fmt = this.#formatValue ?? ((v: string) => this.#defaultFormat(v));
        return fmt(this.value);
    }

    /** Accessible name for one day cell, e.g. "Sunday 1 March 2026". */
    #dayLabel(isoDate: string): string {
        const parsed = parseIsoDate(isoDate);
        if (!parsed) return isoDate;
        try {
            return new Intl.DateTimeFormat(this.locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
            }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)));
        } catch {
            return isoDate;
        }
    }

    /** The "March 2026" heading. */
    #periodText(): string {
        try {
            return new Intl.DateTimeFormat(this.locale, {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
            }).format(new Date(Date.UTC(this.#viewYear, this.#viewMonth - 1, 1)));
        } catch {
            return `${this.#viewYear}-${pad(this.#viewMonth)}`;
        }
    }

    /** Column headings, in this locale, starting on `firstDayOfWeek`. */
    #weekdays(): { short: string; long: string }[] {
        const weekStart = this.firstDayOfWeek;
        const out: { short: string; long: string }[] = [];
        for (let i = 0; i < 7; i++) {
            // 2021-08-01 was a Sunday, so this walks the week from
            // whichever day the locale starts on.
            const d = new Date(Date.UTC(2021, 7, 1 + ((weekStart + i) % 7)));
            try {
                out.push({
                    short: new Intl.DateTimeFormat(this.locale, {
                        weekday: "short",
                        timeZone: "UTC",
                    }).format(d),
                    long: new Intl.DateTimeFormat(this.locale, {
                        weekday: "long",
                        timeZone: "UTC",
                    }).format(d),
                });
            } catch {
                out.push({ short: "", long: "" });
            }
        }
        return out;
    }

    #glyphSpan(char: string): HTMLSpanElement {
        const span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");
        span.textContent = char;
        return span;
    }

    // ---- Rendering ----

    /**
     * Update every state-carrying attribute / text node without
     * rebuilding the DOM: `aria-expanded`, dialog `hidden`, the field's
     * display value and `aria-invalid`, the hidden input, the period
     * heading, the weekday headings, every day cell's date / label /
     * state, the week-number column, and the time selects.
     *
     * Everything here is an in-place write on nodes created by
     * `#render()`, so a state change never destroys focus inside an open
     * dialog or the text field mid-edit. Load-bearing — do not collapse
     * this into `#render()`.
     */
    #syncState(): void {
        if (!this.#rootEl) return;

        if (this.#buttonEl) {
            this.#buttonEl.setAttribute("aria-expanded", String(this.#open));
            this.#buttonEl.setAttribute("aria-label", this.label);
            this.#buttonEl.disabled = this.disabled || this.readonly;
            // Rebuild the trigger content so an overridden
            // renderButtonContent() that reads `this.open` / `this.value`
            // stays current.
            this.#buttonEl.replaceChildren(this.renderButtonContent());
        }

        if (this.#dialogEl) {
            this.#dialogEl.hidden = !this.#open;
            this.#dialogEl.setAttribute("aria-label", this.label);
        }

        if (this.#fieldEl) {
            const display = this.#displayValue();
            // Guarded: while the user is mid-edit, `display` already
            // equals the field's own current value (both derive from
            // `#typed`), so this never disturbs the caret.
            if (this.#fieldEl.value !== display) this.#fieldEl.value = display;
            if (this.#invalid) this.#fieldEl.setAttribute("aria-invalid", "true");
            else this.#fieldEl.removeAttribute("aria-invalid");
            this.#fieldEl.disabled = this.disabled;
            this.#fieldEl.readOnly = this.readonly;
            this.#fieldEl.required = this.required;
            this.#fieldEl.placeholder = this.placeholder ?? "";
            // aria-describedby: the consumer's hint, plus — while
            // invalid, with labels.invalid supplied — the status region,
            // for the assistive technologies that read aria-describedby
            // but not the newer aria-errormessage.
            const announceInvalid = this.#invalid && Boolean(this.#labels.invalid);
            const describedBy = [
                this.describedBy,
                announceInvalid ? this.#statusId : undefined,
            ]
                .filter(Boolean)
                .join(" ");
            if (describedBy) this.#fieldEl.setAttribute("aria-describedby", describedBy);
            else this.#fieldEl.removeAttribute("aria-describedby");
            if (announceInvalid) {
                this.#fieldEl.setAttribute("aria-errormessage", this.#statusId);
            } else {
                this.#fieldEl.removeAttribute("aria-errormessage");
            }
        }

        if (this.#statusEl) {
            // Empty while valid: the region must exist before it has
            // content, because a live region born with its message is
            // routinely not announced at all.
            this.#statusEl.textContent = this.#invalid
                ? (this.#labels.invalid ?? "")
                : "";
        }

        if (this.#hiddenEl) {
            this.#hiddenEl.name = this.name;
            this.#hiddenEl.value = this.value;
        }

        if (this.#usesDate()) {
            if (this.#periodEl) this.#periodEl.textContent = this.#periodText();

            const weekdays = this.#weekdays();
            this.#weekdayThs.forEach((th, i) => {
                th.setAttribute("abbr", weekdays[i]?.long ?? "");
                th.textContent = weekdays[i]?.short ?? "";
            });

            if (this.#weekHeadingTh) {
                const text = this.#labels.week ?? "";
                this.#weekHeadingTh.setAttribute("abbr", text);
                this.#weekHeadingTh.textContent = text;
            }

            const weeks = monthMatrix(this.#viewYear, this.#viewMonth, this.firstDayOfWeek);
            const flat = weeks.flat();
            this.#dayCells.forEach(({ td, button }, i) => {
                const isoDate = flat[i];
                const parsed = parseIsoDate(isoDate);
                const isToday = isoDate === this.#today;
                const isSelected = isoDate === this.#pendingDate;
                const isOutside = parsed?.month !== this.#viewMonth;
                const isDisabled = this.#dayDisabled(isoDate);

                button.dataset.date = isoDate;
                if (isOutside) button.setAttribute("data-outside", "");
                else button.removeAttribute("data-outside");
                if (isToday) button.setAttribute("data-today", "");
                else button.removeAttribute("data-today");
                if (isSelected) button.setAttribute("data-selected", "");
                else button.removeAttribute("data-selected");
                button.tabIndex = isoDate === this.#cursor ? 0 : -1;
                button.setAttribute("aria-label", this.#dayLabel(isoDate));
                if (isToday) button.setAttribute("aria-current", "date");
                else button.removeAttribute("aria-current");
                // aria-disabled, not `disabled`: a vetoed day must stay
                // focusable so the roving cursor can land on it and a
                // screen reader can announce it as unavailable. A
                // `disabled` button refuses focus, and arrowing across
                // a blocked week goes silent while the visible focus
                // stays behind — and the "exactly one tabbable day"
                // invariant breaks. Activation is refused in
                // #selectDay instead.
                if (isDisabled) {
                    button.setAttribute("aria-disabled", "true");
                    button.setAttribute("data-disabled", "");
                } else {
                    button.removeAttribute("aria-disabled");
                    button.removeAttribute("data-disabled");
                }
                button.textContent = String(parsed?.day ?? "");

                td.setAttribute("aria-selected", String(isSelected));
            });

            this.#weekThs.forEach((th, row) => {
                th.textContent = String(isoWeek(weeks[row][0]));
            });
        }

        if (this.#usesTime()) {
            const pendingHour = parseIsoTime(this.#pendingTime)?.hour ?? 0;
            const pendingMinute = parseIsoTime(this.#pendingTime)?.minute ?? 0;

            if (this.#hourSelect) {
                this.#hourSelect.replaceChildren(
                    ...this.#hourOptions().map(({ value, label }) => {
                        const opt = document.createElement("option");
                        opt.value = String(value);
                        opt.textContent = label;
                        return opt;
                    }),
                );
                this.#hourSelect.value = String(pendingHour);
            }

            if (this.#minuteSelect) {
                this.#minuteSelect.replaceChildren(
                    ...this.#minuteOptions().map((m) => {
                        const opt = document.createElement("option");
                        opt.value = String(m);
                        opt.textContent = pad(m);
                        return opt;
                    }),
                );
                this.#minuteSelect.value = String(pendingMinute);
            }

            if (this.#meridiemSelect) {
                const am = document.createElement("option");
                am.value = "am";
                am.textContent = dayPeriodName(this.locale, false);
                const pm = document.createElement("option");
                pm.value = "pm";
                pm.textContent = dayPeriodName(this.locale, true);
                this.#meridiemSelect.replaceChildren(am, pm);
                this.#meridiemSelect.value = pendingHour >= 12 ? "pm" : "am";
            }
        }
    }

    /**
     * Rebuild the whole light-DOM subtree. Runs on connect and on every
     * structural attribute / property change (`mode`, `show-week-numbers`,
     * `hour12`, `locale`, `first-day-of-week`, and assignment to `labels`
     * / `shortcuts`). Closes the dialog first: a rebuild cannot preserve
     * focus, so pretending otherwise would strand it on a detached node.
     */
    #render(): void {
        if (!this.isConnected) return;

        this.#open = false;
        this.#invalid = false;
        this.#typed = null;
        // A rebuild detaches whatever opened the dialog last time.
        this.#openerEl = null;

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `date-time-picker ${extraClass}`.trim();
        root.setAttribute("data-mode", this.mode);

        const hiddenEl = document.createElement("input");
        hiddenEl.type = "hidden";
        hiddenEl.name = this.name;
        hiddenEl.value = this.value;
        root.appendChild(hiddenEl);

        const fieldWrap = document.createElement("div");
        fieldWrap.className = "date-time-picker-field";

        const fieldEl = document.createElement("input");
        fieldEl.className = "date-time-picker-input";
        fieldEl.type = "text";
        fieldEl.autocomplete = "off";
        fieldEl.id = this.inputId;
        fieldEl.value = this.#displayValue();
        fieldEl.disabled = this.disabled;
        fieldEl.readOnly = this.readonly;
        fieldEl.required = this.required;
        if (this.placeholder) fieldEl.placeholder = this.placeholder;
        if (this.describedBy) fieldEl.setAttribute("aria-describedby", this.describedBy);
        fieldEl.addEventListener("input", this.#onFieldInput);
        fieldEl.addEventListener("blur", this.#onFieldBlur);
        fieldEl.addEventListener("keydown", this.#onFieldKeydown);
        fieldWrap.appendChild(fieldEl);

        const buttonEl = document.createElement("button");
        buttonEl.type = "button";
        buttonEl.className = "date-time-picker-button";
        buttonEl.setAttribute("aria-label", this.label);
        buttonEl.setAttribute("aria-haspopup", "dialog");
        buttonEl.setAttribute("aria-expanded", "false");
        buttonEl.setAttribute("aria-controls", this.dialogId);
        buttonEl.disabled = this.disabled || this.readonly;
        buttonEl.appendChild(this.renderButtonContent());
        buttonEl.addEventListener("click", () => (this.#open ? this.#closeDialog() : this.openDialog()));
        fieldWrap.appendChild(buttonEl);

        root.appendChild(fieldWrap);

        const usesDate = this.#usesDate();
        const usesTime = this.#usesTime();
        const labels = this.#labels;

        let statusEl: HTMLSpanElement | null = null;
        if (labels.invalid) {
            // Present in the DOM before it has content: a live region
            // that appears at the same moment as its message is
            // routinely not announced at all. Empty while the field is
            // valid; #syncState() fills it on refusal. Renders only
            // when the consumer supplied the message — the component
            // never invents English.
            statusEl = document.createElement("span");
            statusEl.className = "date-time-picker-status";
            statusEl.id = this.#statusId;
            statusEl.setAttribute("role", "status");
            root.appendChild(statusEl);
        }

        const dialogEl = document.createElement("div");
        dialogEl.className = "date-time-picker-dialog";
        dialogEl.id = this.dialogId;
        dialogEl.setAttribute("role", "dialog");
        dialogEl.setAttribute("aria-modal", "true");
        dialogEl.setAttribute("aria-label", this.label);
        dialogEl.tabIndex = -1;
        dialogEl.hidden = true;
        dialogEl.addEventListener("keydown", this.#onDialogKeydown);

        if (labels.instructions) {
            // Spoken once when the dialog takes focus, via the dialog's
            // aria-describedby. Visible by default; a consumer who
            // wants it screen-reader-only hides it with their own CSS.
            dialogEl.setAttribute("aria-describedby", this.#instructionsId);
            const help = document.createElement("p");
            help.className = "date-time-picker-instructions";
            help.id = this.#instructionsId;
            help.textContent = labels.instructions;
            dialogEl.appendChild(help);
        }

        let periodEl: HTMLSpanElement | null = null;
        let tableEl: HTMLTableElement | null = null;
        const weekdayThs: HTMLTableCellElement[] = [];
        let weekHeadingTh: HTMLTableCellElement | null = null;
        const weekThs: HTMLTableCellElement[] = [];
        const dayCells: { td: HTMLTableCellElement; button: HTMLButtonElement }[] = [];

        if (usesDate) {
            const header = document.createElement("div");
            header.className = "date-time-picker-header";

            const previousYear = document.createElement("button");
            previousYear.type = "button";
            previousYear.className = "date-time-picker-previous-year";
            previousYear.setAttribute("aria-label", labels.previousYear);
            previousYear.appendChild(this.#glyphSpan("«"));
            previousYear.addEventListener("click", () => this.#shiftYear(-1));
            header.appendChild(previousYear);

            const previousMonth = document.createElement("button");
            previousMonth.type = "button";
            previousMonth.className = "date-time-picker-previous-month";
            previousMonth.setAttribute("aria-label", labels.previousMonth);
            previousMonth.appendChild(this.#glyphSpan("‹"));
            previousMonth.addEventListener("click", () => this.#shiftMonth(-1));
            header.appendChild(previousMonth);

            periodEl = document.createElement("span");
            periodEl.className = "date-time-picker-period";
            periodEl.id = this.#periodId;
            periodEl.setAttribute("aria-live", "polite");
            header.appendChild(periodEl);

            const nextMonth = document.createElement("button");
            nextMonth.type = "button";
            nextMonth.className = "date-time-picker-next-month";
            nextMonth.setAttribute("aria-label", labels.nextMonth);
            nextMonth.appendChild(this.#glyphSpan("›"));
            nextMonth.addEventListener("click", () => this.#shiftMonth(1));
            header.appendChild(nextMonth);

            const nextYear = document.createElement("button");
            nextYear.type = "button";
            nextYear.className = "date-time-picker-next-year";
            nextYear.setAttribute("aria-label", labels.nextYear);
            nextYear.appendChild(this.#glyphSpan("»"));
            nextYear.addEventListener("click", () => this.#shiftYear(1));
            header.appendChild(nextYear);

            dialogEl.appendChild(header);

            tableEl = document.createElement("table");
            tableEl.className = "date-time-picker-calendar";
            tableEl.setAttribute("role", "grid");
            tableEl.setAttribute("aria-labelledby", this.#periodId);
            tableEl.addEventListener("keydown", this.#onGridKeydown);

            const thead = document.createElement("thead");
            const headRow = document.createElement("tr");
            if (this.showWeekNumbers) {
                weekHeadingTh = document.createElement("th");
                weekHeadingTh.className = "date-time-picker-week-heading";
                weekHeadingTh.scope = "col";
                headRow.appendChild(weekHeadingTh);
            }
            for (let i = 0; i < 7; i++) {
                const th = document.createElement("th");
                th.className = "date-time-picker-weekday";
                th.scope = "col";
                headRow.appendChild(th);
                weekdayThs.push(th);
            }
            thead.appendChild(headRow);
            tableEl.appendChild(thead);

            const tbody = document.createElement("tbody");
            for (let row = 0; row < 6; row++) {
                const tr = document.createElement("tr");
                if (this.showWeekNumbers) {
                    const weekTh = document.createElement("th");
                    weekTh.className = "date-time-picker-week";
                    weekTh.scope = "row";
                    tr.appendChild(weekTh);
                    weekThs.push(weekTh);
                }
                for (let col = 0; col < 7; col++) {
                    const td = document.createElement("td");
                    td.setAttribute("role", "gridcell");
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "date-time-picker-day";
                    button.addEventListener("click", () => {
                        const iso = button.dataset.date;
                        if (iso) this.#selectDay(iso);
                    });
                    td.appendChild(button);
                    tr.appendChild(td);
                    dayCells.push({ td, button });
                }
                tbody.appendChild(tr);
            }
            tableEl.appendChild(tbody);
            dialogEl.appendChild(tableEl);
        }

        let hourSelect: HTMLSelectElement | null = null;
        let minuteSelect: HTMLSelectElement | null = null;
        let meridiemSelect: HTMLSelectElement | null = null;

        if (usesTime) {
            const timeWrap = document.createElement("div");
            timeWrap.className = "date-time-picker-time";

            const hourLabel = document.createElement("label");
            hourLabel.className = "date-time-picker-time-label";
            hourLabel.htmlFor = this.#hourId;
            hourLabel.textContent = labels.hour ?? "";
            timeWrap.appendChild(hourLabel);

            hourSelect = document.createElement("select");
            hourSelect.className = "date-time-picker-hour";
            hourSelect.id = this.#hourId;
            hourSelect.addEventListener("change", () => this.#setHour(Number(hourSelect!.value)));
            timeWrap.appendChild(hourSelect);

            const minuteLabel = document.createElement("label");
            minuteLabel.className = "date-time-picker-time-label";
            minuteLabel.htmlFor = this.#minuteId;
            minuteLabel.textContent = labels.minute ?? "";
            timeWrap.appendChild(minuteLabel);

            minuteSelect = document.createElement("select");
            minuteSelect.className = "date-time-picker-minute";
            minuteSelect.id = this.#minuteId;
            minuteSelect.addEventListener("change", () => this.#setMinute(Number(minuteSelect!.value)));
            timeWrap.appendChild(minuteSelect);

            if (this.hour12) {
                const meridiemLabel = document.createElement("label");
                meridiemLabel.className = "date-time-picker-time-label";
                meridiemLabel.htmlFor = this.#meridiemId;
                meridiemLabel.textContent = labels.meridiem ?? "";
                timeWrap.appendChild(meridiemLabel);

                meridiemSelect = document.createElement("select");
                meridiemSelect.className = "date-time-picker-meridiem";
                meridiemSelect.id = this.#meridiemId;
                meridiemSelect.addEventListener("change", () =>
                    this.#setMeridiem(meridiemSelect!.value === "pm"),
                );
                timeWrap.appendChild(meridiemSelect);
            }

            dialogEl.appendChild(timeWrap);
        }

        const shortcuts = this.#shortcuts;
        if (shortcuts.length > 0) {
            const wrap = document.createElement("div");
            wrap.className = "date-time-picker-shortcuts";
            for (const shortcut of shortcuts) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "date-time-picker-shortcut";
                button.dataset.shortcutId = shortcut.id;
                button.textContent = shortcut.label;
                button.addEventListener("click", () => this.#applyShortcut(shortcut));
                wrap.appendChild(button);
            }
            dialogEl.appendChild(wrap);
        }

        const footer = document.createElement("div");
        footer.className = "date-time-picker-footer";

        if (labels.clear) {
            const clearBtn = document.createElement("button");
            clearBtn.type = "button";
            clearBtn.className = "date-time-picker-clear";
            clearBtn.textContent = labels.clear;
            clearBtn.addEventListener("click", () => this.#clear());
            footer.appendChild(clearBtn);
        }

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "date-time-picker-cancel";
        cancelBtn.textContent = labels.cancel;
        cancelBtn.addEventListener("click", () => this.#closeDialog());
        footer.appendChild(cancelBtn);

        const confirmBtn = document.createElement("button");
        confirmBtn.type = "button";
        confirmBtn.className = "date-time-picker-confirm";
        confirmBtn.textContent = labels.confirm;
        confirmBtn.addEventListener("click", () => this.#commit());
        footer.appendChild(confirmBtn);

        dialogEl.appendChild(footer);
        root.appendChild(dialogEl);

        this.#rootEl = root;
        this.#fieldEl = fieldEl;
        this.#buttonEl = buttonEl;
        this.#dialogEl = dialogEl;
        this.#hiddenEl = hiddenEl;
        this.#statusEl = statusEl;
        this.#periodEl = periodEl;
        this.#tableEl = tableEl;
        this.#weekdayThs = weekdayThs;
        this.#weekHeadingTh = weekHeadingTh;
        this.#weekThs = weekThs;
        this.#dayCells = dayCells;
        this.#hourSelect = hourSelect;
        this.#minuteSelect = minuteSelect;
        this.#meridiemSelect = meridiemSelect;

        this.replaceChildren(root);

        this.#syncState();
    }
}
