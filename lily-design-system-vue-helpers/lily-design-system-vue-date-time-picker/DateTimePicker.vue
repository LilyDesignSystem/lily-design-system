<script lang="ts">
/**
 * Default button glyph: U+1F4C5 CALENDAR, followed by U+FE0E VARIATION
 * SELECTOR-15 to request text (monochrome) presentation.
 *
 * Same construction as locale-picker's globe. The variation selector is a
 * hint, not a guarantee — several platforms ignore it and render the emoji
 * anyway — but where it is honoured the glyph inherits the page's text
 * colour and stops looking like a sticker among the siblings' ◑, "A" and
 * ➤. Written as an escape, never as a bare character: a variation
 * selector has no visual form at all, so a bare one is invisible in an
 * editor and trivially lost to a careless edit.
 */
export const CALENDAR = "📅︎";

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
    /** Stable identifier, passed back with the `shortcut` event. */
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
 * Grouped into one object rather than spread across a dozen flat
 * `*Label` props. The sibling helpers use flat props because they need
 * two or three strings; this one needs ten, and ten flat props is a call
 * site nobody can read. One object also maps cleanly onto a translation
 * bundle, which is how these strings actually arrive.
 *
 * The four navigation labels and the two footer labels are required: they
 * name buttons that always render, and a button whose accessible name we
 * invented in English is precisely the defect this package exists to
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

/** Arguments passed to the default scoped slot (the button glyph). */
export type SlotArgs = {
    /** The committed value, in ISO form. */
    value: string;
    /** Is the dialog open? */
    open: boolean;
    /** The value as the user sees it in the field. */
    display: string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for DateTimePicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the trigger button and the dialog. */
    label: string;
    /** Every other user-facing string. */
    labels: DateTimePickerLabels;
    /** What to collect: a date, a time, or both. */
    mode?: DateTimeMode;
    /** ISO value: `YYYY-MM-DD`, `HH:MM`, or `YYYY-MM-DDTHH:MM`. Two-way bindable via v-model:value. */
    value?: string;
    /** BCP 47 tag driving month names, weekday names and first weekday. */
    locale?: string;
    /** Earliest selectable date, ISO. */
    min?: string;
    /** Latest selectable date, ISO. */
    max?: string;
    /** Veto individual dates — true means "cannot be picked". */
    isDateDisabled?: (isoDate: string) => boolean;
    /** 0 = Sunday … 6 = Saturday. Defaults to the locale's convention. */
    firstDayOfWeek?: number;
    /** Granularity of the minute select. */
    minuteStep?: number;
    /** 12-hour clock. Defaults to the locale's convention. */
    hour12?: boolean;
    /** Render an ISO-8601 week-number column. */
    showWeekNumbers?: boolean;
    /** Quick-pick buttons. */
    shortcuts?: DateTimeShortcut[];
    /** Commit and close as soon as a day is chosen. Defaults to date-only. */
    confirmOnSelect?: boolean;
    /** `name` of the hidden input that carries the value in a form post. */
    name?: string;
    /** `id` of the text field, so a consumer `<label for>` can name it. */
    inputId?: string;
    /** Forwarded to the text field as `aria-describedby`. */
    describedBy?: string;
    /** Placeholder for the text field. */
    placeholder?: string;
    /** Disable the whole control. */
    disabled?: boolean;
    /** Show the value but refuse edits. */
    readonly?: boolean;
    /** Mark the field required. */
    required?: boolean;
    /** Override how a committed value is rendered into the text field. */
    formatValue?: (value: string) => string;
    /** Override how typed text is turned back into an ISO value. */
    parseInput?: (text: string) => string | null;
    /** Extra CSS class on the root. */
    class?: string;
};

// -----------------------------------------------------------------
// Civil-date arithmetic
//
// Pure and total: no local-time `Date` values, no throwing, null for
// "not a date". Exported so the acceptance tests can exercise the
// arithmetic directly rather than only through the rendered grid.
// -----------------------------------------------------------------

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
 * `"2026-02-31"` is null and not the 3rd of March. A field that silently
 * reinterprets an impossible date is worse than one that refuses it.
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
 * Rolling over is what `Date.prototype.setMonth` does and it is almost
 * never what someone paging a calendar means.
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
 * Weeks start Monday and week 1 is the one containing the first Thursday,
 * which is why this pivots on Thursday rather than counting from
 * 1 January. Public-sector and clinical rotas quote ISO week numbers, so
 * the column is worth getting exactly right.
 */
export function isoWeek(isoDate: string): number {
    if (!parseIsoDate(isoDate)) return 0;
    const mondayIndex = (weekdayOf(isoDate) + 6) % 7;
    const thursday = addDays(isoDate, 3 - mondayIndex);
    const parsed = parseIsoDate(thursday);
    if (!parsed) return 0;
    const jan1 = parseIsoDate(
        formatIsoDate({ year: parsed.year, month: 1, day: 1 }),
    );
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
export function joinValue(
    date: string,
    time: string,
    mode: DateTimeMode,
): string {
    if (mode === "date") return date;
    if (mode === "time") return time;
    return date && time ? `${date}T${time}` : "";
}

/** Is `isoDate` inside the inclusive [min, max] window? Empty bounds pass. */
export function withinRange(
    isoDate: string,
    min?: string,
    max?: string,
): boolean {
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
 * recent enough that a fallback still earns its place — and it is
 * missing from some SSR runtimes entirely. The fallback is a short
 * region table plus a Monday default, Monday being both the ISO-8601
 * rule and the majority convention worldwide.
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
            if (info && typeof info.firstDay === "number") {
                return info.firstDay % 7;
            }
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
 * Fixed height on purpose. A grid sized to its month runs four to six
 * rows, so the footer — and the confirm button in it — moves vertically
 * as you page months. That is a Fitts's-law tax on every subsequent
 * click and it makes the dialog jump under the pointer. A constant six
 * rows costs at most one extra trailing week.
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
        for (let col = 0; col < 7; col++) {
            week.push(addDays(start, row * 7 + col));
        }
        weeks.push(week);
    }
    return weeks;
}

/** Long and short month names for a locale, index 0 = January. */
export function monthNames(locale?: string): {
    long: string[];
    short: string[];
} {
    const build = (month: "long" | "short") => {
        try {
            const fmt = new Intl.DateTimeFormat(locale, {
                month,
                timeZone: "UTC",
            });
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
function matchMonthName(
    token: string,
    names: { long: string[]; short: string[] },
): number {
    const norm = (s: string) =>
        s.toLocaleLowerCase().replace(/\.$/, "").normalize("NFKD");
    const t = norm(token);
    if (!t || /^\d+$/.test(t)) return 0;
    for (let i = 0; i < 12; i++) {
        if (norm(names.long[i] ?? "") === t) return i + 1;
        if (norm(names.short[i] ?? "") === t) return i + 1;
    }
    // Prefix match, so "Sept" finds September. Three characters minimum:
    // "Ma" cannot choose between March and May, and guessing there would
    // be worse than refusing.
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
export function numericFieldOrder(
    locale?: string,
): ("day" | "month" | "year")[] {
    try {
        const parts = new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
        }).formatToParts(new Date(Date.UTC(2021, 4, 6)));
        const order = parts
            .map((p) => p.type)
            .filter(
                (t): t is "day" | "month" | "year" =>
                    t === "day" || t === "month" || t === "year",
            );
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
 * follows the locale, so `03/04/2026` is 3 April in en-GB and 4 March in
 * en-US — which is what each user means; and a form with a written month
 * matched against the locale's own long and short month names, which is
 * what lets DHCW's `27-Jun-2025` round-trip.
 *
 * Anything else is null. Guessing harder than this is how date fields
 * silently record the wrong day.
 */
export function parseDateInput(
    text: string,
    locale?: string,
): string | null {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const iso = parseIsoDate(trimmed);
    if (iso) return formatIsoDate(iso);

    const parts = trimmed.split(/[\s./-]+/).filter(Boolean);
    if (parts.length !== 3) return null;

    // Look for a written month first. Whichever field it is, the other
    // two are the day and the year, and their order is then decidable
    // without knowing the locale: the larger number is the year.
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
        const rest = parts
            .filter((_, i) => i !== monthIndex)
            .map((p) => Number(p));
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

    // Two-digit years: the usual 70 pivot. Documented rather than clever,
    // because any choice here is wrong for someone.
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

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextDateTimePickerId(): string {
    uid += 1;
    return `date-time-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    mode: "date",
    value: "",
    locale: undefined,
    min: undefined,
    max: undefined,
    isDateDisabled: undefined,
    firstDayOfWeek: undefined,
    minuteStep: 1,
    hour12: undefined,
    showWeekNumbers: false,
    shortcuts: () => [],
    confirmOnSelect: undefined,
    name: "date-time",
    inputId: undefined,
    describedBy: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    formatValue: undefined,
    parseInput: undefined,
    class: "",
});

// The Svelte canonical takes `onChange` / `onShortcut` / `onInvalidInput`
// callback props; the Vue idiom for the same contract is emitted events,
// the same way `share-picker`'s `onShare` maps to `@share`. `value` is
// two-way bindable via `v-model:value`, matching `theme-picker` and
// `locale-picker`.
const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
    (event: "shortcut", id: string, isoDate: string): void;
    (event: "invalidInput", text: string): void;
}>();

const baseId = nextDateTimePickerId();
const dialogId = `${baseId}-dialog`;
const periodId = `${baseId}-period`;
const hourId = `${baseId}-hour`;
const minuteId = `${baseId}-minute`;
const meridiemId = `${baseId}-meridiem`;
const statusId = `${baseId}-status`;
const instructionsId = `${baseId}-instructions`;

const open = ref(false);
const invalid = ref(false);

/**
 * Text the user has typed but not yet resolved.
 *
 * `null` means "no pending edit, show the formatted value". An empty
 * string is a real state (the user cleared the field) and must not
 * collapse into `null`.
 */
const typed = ref<string | null>(null);

const rootEl = ref<HTMLDivElement | null>(null);
const buttonEl = ref<HTMLButtonElement | null>(null);
const dialogEl = ref<HTMLDivElement | null>(null);
const gridEl = ref<HTMLTableElement | null>(null);

/**
 * The element that opened the dialog, so close can return focus to it.
 *
 * The APG rule is "focus returns to the element that invoked the
 * dialog" — which is the trigger button on a click, but the *text
 * field* when the user pressed Alt+ArrowDown. Always refocusing the
 * button strands a keyboard user one Tab stop past where they were.
 * A plain variable, not a ref: nothing renders from it.
 */
let openerEl: HTMLElement | null = null;

/**
 * The pending selection, live only while the dialog is open.
 *
 * Kept separate from `value` so Cancel and Escape can genuinely revert. A
 * picker that writes through on every arrow key has no cancel — only an
 * undo the user has to perform by hand, from memory.
 */
const pendingDate = ref("");
const pendingTime = ref("");

/**
 * Internal source of truth for the committed value, so the control works
 * both controlled (consumer drives `v-model:value`) and uncontrolled (no
 * binding at all). Mirrors `locale-picker` / `theme-picker`.
 */
const current = ref(props.value ?? "");

watch(
    () => props.value,
    (next) => {
        if (next !== undefined && next !== current.value) current.value = next;
    },
);

/**
 * The month on screen, seeded synchronously from `value`.
 *
 * Synchronously, not in an effect, so that server-rendered markup shows
 * the month of the supplied value rather than January 1970 — the flicker
 * a consumer avoids precisely by resolving `value` on the server. Today
 * is NOT read here: `new Date()` at setup time would differ between a
 * server and a client sitting on opposite sides of midnight, which is a
 * hydration mismatch. That one waits for `onMounted`.
 */
const initialAnchor = parseIsoDate(splitValue(props.value ?? "", props.mode ?? "date").date);

const viewYear = ref(initialAnchor?.year ?? 1970);
const viewMonth = ref(initialAnchor?.month ?? 1);

/** The day the grid's roving tabindex sits on. */
const cursor = ref(initialAnchor ? formatIsoDate(initialAnchor) : "");

/**
 * Today, sampled at mount and refreshed whenever the dialog opens. Not
 * re-read per cell: the grid asks "is this today?" 42 times a render, and
 * a clock read per cell buys nothing over a clock read per open.
 */
const today = ref("");

const committed = computed(() => splitValue(current.value ?? "", props.mode ?? "date"));
const weekStart = computed(() => props.firstDayOfWeek ?? firstDayOfWeekFor(props.locale));
const commitOnDay = computed(() => props.confirmOnSelect ?? (props.mode ?? "date") === "date");
const usesDate = computed(() => (props.mode ?? "date") !== "time");
const usesTime = computed(() => (props.mode ?? "date") !== "date");
const fieldId = computed(() => props.inputId ?? `${baseId}-input`);

/**
 * The host's current calendar day.
 *
 * Read through the *local* getters, because "today" is a wall-clock
 * question: someone in Auckland at 09:00 on the 5th is not having the
 * 4th, whatever UTC says.
 */
function todayIso(): string {
    const now = new Date();
    return formatIsoDate({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    });
}

// ---------------------------------------------------------------
// Formatting — every visible string comes from Intl or from a prop
// ---------------------------------------------------------------

const clock12 = computed(() => props.hour12 ?? localeUsesHour12(props.locale));

/** Does this locale write times on a 12-hour clock? */
function localeUsesHour12(loc?: string): boolean {
    try {
        const parts = new Intl.DateTimeFormat(loc, {
            hour: "numeric",
            timeZone: "UTC",
        }).formatToParts(new Date(Date.UTC(2021, 0, 1, 13)));
        return parts.some((p) => p.type === "dayPeriod");
    } catch {
        return false;
    }
}

/** The locale's own AM / PM strings, so neither is hardcoded. */
function dayPeriodName(pm: boolean): string {
    try {
        const parts = new Intl.DateTimeFormat(props.locale, {
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

function formatTimeForDisplay(isoTime: string): string {
    const parsed = parseIsoTime(isoTime);
    if (!parsed) return isoTime;
    try {
        return new Intl.DateTimeFormat(props.locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: clock12.value,
            timeZone: "UTC",
        }).format(new Date(Date.UTC(2021, 0, 1, parsed.hour, parsed.minute)));
    } catch {
        return isoTime;
    }
}

/** Render an ISO value the way this locale writes it. */
function defaultFormat(isoValue: string): string {
    if (!isoValue) return "";
    const { date, time } = splitValue(isoValue, props.mode ?? "date");
    const chunks: string[] = [];
    const parsed = date ? parseIsoDate(date) : null;
    if (parsed) {
        try {
            chunks.push(
                new Intl.DateTimeFormat(props.locale, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                }).format(
                    new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)),
                ),
            );
        } catch {
            chunks.push(date);
        }
    }
    if (time) chunks.push(formatTimeForDisplay(time));
    return chunks.join(" ");
}

/** The text shown in the field. A pending edit wins until resolved. */
const display = computed(() =>
    typed.value !== null ? typed.value : (props.formatValue ?? defaultFormat)(current.value ?? ""),
);

/**
 * `aria-describedby` for the field: the consumer's hint, plus — while
 * invalid, with `labels.invalid` supplied — the status region, for the
 * assistive technologies that read `aria-describedby` but not the
 * newer `aria-errormessage`.
 */
const fieldDescribedBy = computed(
    () =>
        [
            props.describedBy,
            invalid.value && props.labels.invalid ? statusId : undefined,
        ]
            .filter(Boolean)
            .join(" ") || undefined,
);

/** Accessible name for one day cell, e.g. "Sunday 1 March 2026". */
function dayLabel(isoDate: string): string {
    const parsed = parseIsoDate(isoDate);
    if (!parsed) return isoDate;
    try {
        return new Intl.DateTimeFormat(props.locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        }).format(
            new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)),
        );
    } catch {
        return isoDate;
    }
}

/** The "March 2026" heading. */
const periodText = computed(() => {
    try {
        return new Intl.DateTimeFormat(props.locale, {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        }).format(new Date(Date.UTC(viewYear.value, viewMonth.value - 1, 1)));
    } catch {
        return `${viewYear.value}-${pad(viewMonth.value)}`;
    }
});

/** Column headings, in this locale, starting on `weekStart`. */
const weekdays = computed(() => {
    const out: { short: string; long: string }[] = [];
    for (let i = 0; i < 7; i++) {
        // 2021-08-01 was a Sunday, so this walks the week from whichever
        // day the locale starts on.
        const d = new Date(Date.UTC(2021, 7, 1 + ((weekStart.value + i) % 7)));
        try {
            out.push({
                short: new Intl.DateTimeFormat(props.locale, {
                    weekday: "short",
                    timeZone: "UTC",
                }).format(d),
                long: new Intl.DateTimeFormat(props.locale, {
                    weekday: "long",
                    timeZone: "UTC",
                }).format(d),
            });
        } catch {
            out.push({ short: "", long: "" });
        }
    }
    return out;
});

const weeks = computed(() => monthMatrix(viewYear.value, viewMonth.value, weekStart.value));

// ---------------------------------------------------------------
// Selectability
// ---------------------------------------------------------------

function dayDisabled(isoDate: string): boolean {
    if (!withinRange(isoDate, props.min, props.max)) return true;
    return props.isDateDisabled?.(isoDate) === true;
}

/** The nearest selectable day to `isoDate`, searching outwards. */
function nearestSelectable(isoDate: string): string {
    if (!dayDisabled(isoDate)) return isoDate;
    // Bounded: a year either way is far beyond any real min/max window,
    // and an unbounded search would hang on a predicate that disables
    // everything.
    for (let delta = 1; delta <= 366; delta++) {
        const after = addDays(isoDate, delta);
        if (!dayDisabled(after)) return after;
        const before = addDays(isoDate, -delta);
        if (!dayDisabled(before)) return before;
    }
    return isoDate;
}

// ---------------------------------------------------------------
// Open / close / commit
// ---------------------------------------------------------------

async function openDialog(): Promise<void> {
    if (props.disabled || props.readonly) return;
    const active = document.activeElement;
    openerEl =
        active instanceof HTMLElement && rootEl.value?.contains(active)
            ? active
            : (buttonEl.value ?? null);
    today.value = todayIso();
    pendingDate.value = committed.value.date || nearestSelectable(today.value);
    pendingTime.value = committed.value.time || defaultTime();
    cursor.value = pendingDate.value;
    const anchor = parseIsoDate(pendingDate.value) ?? parseIsoDate(today.value);
    if (anchor) {
        viewYear.value = anchor.year;
        viewMonth.value = anchor.month;
    }
    open.value = true;
    // A `hidden` element cannot take focus until the DOM has flushed.
    await nextTick();
    focusInitial();
}

/** Where an unset time starts: now, snapped down to the step. */
function defaultTime(): string {
    if (!usesTime.value) return "";
    const now = new Date();
    const step = Math.max(1, props.minuteStep ?? 1);
    return formatIsoTime({
        hour: now.getHours(),
        minute: Math.floor(now.getMinutes() / step) * step,
    });
}

/** Focus the grid cursor, or the first control when there is no grid. */
function focusInitial(): void {
    if (usesDate.value) {
        focusCursor();
        return;
    }
    focusables()[0]?.focus?.();
}

async function closeDialog(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    if (refocus) {
        // Return focus to whichever element opened the dialog — the text
        // field after Alt+ArrowDown, the trigger button after a click —
        // per the APG dialog rule, falling back to the button.
        const target = openerEl ?? buttonEl.value;
        await nextTick();
        target?.focus?.();
    }
}

/** Commit the pending selection to `value` and notify. */
function commit(): void {
    const next = joinValue(pendingDate.value, pendingTime.value, props.mode ?? "date");
    // An incomplete datetime is not committed. Half a timestamp is not a
    // smaller truth; it is a different one.
    if (!next) return;
    typed.value = null;
    invalid.value = false;
    if (next !== current.value) {
        current.value = next;
        emit("update:value", next);
        emit("change", next);
    }
    void closeDialog();
}

function clear(): void {
    typed.value = null;
    invalid.value = false;
    if (current.value !== "") {
        current.value = "";
        emit("update:value", "");
        emit("change", "");
    }
    void closeDialog();
}

// ---------------------------------------------------------------
// Grid navigation
// ---------------------------------------------------------------

/**
 * Move the cursor, paging the view when the target is off-screen.
 *
 * Disabled days are still reachable — the cursor lands on them and the
 * button is `aria-disabled` (never the `disabled` attribute, so it can
 * take real focus), so arrowing across a blocked range works. What is
 * refused is leaving the min/max window entirely, because there is
 * nothing out there to navigate to.
 */
async function moveCursor(nextIso: string): Promise<void> {
    if (!withinRange(nextIso, props.min, props.max)) return;
    cursor.value = nextIso;
    const parsed = parseIsoDate(nextIso);
    if (parsed && (parsed.year !== viewYear.value || parsed.month !== viewMonth.value)) {
        viewYear.value = parsed.year;
        viewMonth.value = parsed.month;
    }
    await nextTick();
    focusCursor();
}

function focusCursor(): void {
    if (!dialogEl.value || !cursor.value) return;
    // An attribute selector, not `#id`: the id is not on this element, and
    // a value we generated as `YYYY-MM-DD` needs no escaping.
    const el = dialogEl.value.querySelector<HTMLElement>(`[data-date="${cursor.value}"]`);
    // Guard the METHODS, not only the element. jsdom implements no
    // `scrollIntoView`, and an unguarded call throws from inside a keydown
    // handler — where it stays invisible to a green suite. This is the
    // third time this shape has bitten these helpers.
    el?.focus?.();
    el?.scrollIntoView?.({ block: "nearest" });
}

function selectDay(isoDate: string): void {
    if (dayDisabled(isoDate)) return;
    pendingDate.value = isoDate;
    cursor.value = isoDate;
    if (commitOnDay.value) commit();
}

async function shiftMonth(delta: number): Promise<void> {
    const anchor = formatIsoDate({ year: viewYear.value, month: viewMonth.value, day: 1 });
    const next = parseIsoDate(addMonths(anchor, delta));
    if (!next) return;
    // Refocus the cursor only when focus is already in the grid: grid
    // paging (PageUp/PageDown, or a browser that focused nothing on
    // click) must carry focus, or it dies with the unrendered cell —
    // but a header button must keep focus, or its user is yanked into
    // the grid after one activation and cannot page twice.
    const hadGridFocus = gridEl.value?.contains(document.activeElement) === true;
    viewYear.value = next.year;
    viewMonth.value = next.month;
    // Carry the cursor into the new month rather than leaving the roving
    // tabindex on a cell that is no longer rendered.
    const c = parseIsoDate(cursor.value);
    if (c) {
        cursor.value = formatIsoDate({
            year: next.year,
            month: next.month,
            day: Math.min(c.day, daysInMonth(next.year, next.month)),
        });
        if (hadGridFocus) {
            await nextTick();
            focusCursor();
        }
    }
}

function shiftYear(delta: number): void {
    void shiftMonth(delta * 12);
}

function onGridKeydown(event: KeyboardEvent): void {
    switch (event.key) {
        case "ArrowLeft":
            event.preventDefault();
            void moveCursor(addDays(cursor.value, -1));
            break;
        case "ArrowRight":
            event.preventDefault();
            void moveCursor(addDays(cursor.value, 1));
            break;
        case "ArrowUp":
            event.preventDefault();
            void moveCursor(addDays(cursor.value, -7));
            break;
        case "ArrowDown":
            event.preventDefault();
            void moveCursor(addDays(cursor.value, 7));
            break;
        case "Home": {
            event.preventDefault();
            const offset = (weekdayOf(cursor.value) - weekStart.value + 7) % 7;
            void moveCursor(addDays(cursor.value, -offset));
            break;
        }
        case "End": {
            event.preventDefault();
            const offset = (weekdayOf(cursor.value) - weekStart.value + 7) % 7;
            void moveCursor(addDays(cursor.value, 6 - offset));
            break;
        }
        case "PageUp":
            event.preventDefault();
            if (event.shiftKey) shiftYear(-1);
            else void shiftMonth(-1);
            break;
        case "PageDown":
            event.preventDefault();
            if (event.shiftKey) shiftYear(1);
            else void shiftMonth(1);
            break;
        case "Enter":
        case " ":
            event.preventDefault();
            selectDay(cursor.value);
            break;
    }
}

// ---------------------------------------------------------------
// Dialog keys and the focus trap
// ---------------------------------------------------------------

/** Everything tabbable inside the dialog, in DOM order. */
function focusables(): HTMLElement[] {
    if (!dialogEl.value) return [];
    return Array.from(
        dialogEl.value.querySelectorAll<HTMLElement>(
            'button:not([disabled]):not([tabindex="-1"]), select:not([disabled])',
        ),
    );
}

function onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
        event.preventDefault();
        // Escape discards: `value` is untouched, so the field still shows
        // whatever was committed before the dialog opened.
        void closeDialog();
        return;
    }
    if (event.key !== "Tab") return;

    // The trap. `aria-modal="true"` is a promise that focus cannot reach
    // the page behind the dialog, and it is a promise the browser does
    // not keep for us: an untrapped aria-modal dialog tells a screen
    // reader the rest of the page is inert while Tab quietly walks into
    // it. DHCW's picker declares aria-modal and traps nothing, which is
    // the bug this block exists to not have.
    const all = focusables();
    if (all.length === 0) return;
    const first = all[0];
    const last = all[all.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && (active === first || !dialogEl.value?.contains(active))) {
        event.preventDefault();
        last.focus?.();
    } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus?.();
    }
}

// ---------------------------------------------------------------
// Text field
// ---------------------------------------------------------------

function onInput(event: Event): void {
    typed.value = (event.currentTarget as HTMLInputElement).value;
}

/** Default text parsing, per mode. */
function parseTypedForMode(text: string): string | null {
    if (props.mode === "time") return parseTimeInput(text);
    if (props.mode === "datetime") {
        // Split on the last whitespace run or a literal T, and require
        // both halves — see `commit` on why half is refused.
        const m = /^(.*?)[T\s]+([^\sT]+)$/.exec(text.trim());
        if (!m) return null;
        const date = parseDateInput(m[1], props.locale);
        const time = parseTimeInput(m[2]);
        return date && time ? `${date}T${time}` : null;
    }
    return parseDateInput(text, props.locale);
}

/** Resolve typed text on blur or Enter. */
function resolveTyped(): void {
    if (typed.value === null) return;
    const text = typed.value;

    if (!text.trim()) {
        typed.value = null;
        invalid.value = false;
        if (current.value !== "") {
            current.value = "";
            emit("update:value", "");
            emit("change", "");
        }
        return;
    }

    const parsed = props.parseInput ? props.parseInput(text) : parseTypedForMode(text);
    if (!parsed) {
        invalid.value = true;
        emit("invalidInput", text);
        return;
    }

    const { date } = splitValue(parsed, props.mode ?? "date");
    if (usesDate.value && date && dayDisabled(date)) {
        // Parseable but out of bounds. Same outcome as unparseable: the
        // text stays put and the field is marked invalid, rather than
        // being silently snapped to some nearby legal date the user
        // never typed.
        invalid.value = true;
        emit("invalidInput", text);
        return;
    }

    typed.value = null;
    invalid.value = false;
    if (parsed !== current.value) {
        current.value = parsed;
        emit("update:value", parsed);
        emit("change", parsed);
    }
}

function onFieldKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
        event.preventDefault();
        resolveTyped();
    } else if (event.key === "ArrowDown" && event.altKey) {
        // The platform convention for "open the picker" from a field,
        // matching <input type="date"> in every major browser.
        event.preventDefault();
        void openDialog();
    } else if (event.key === "Escape" && typed.value !== null) {
        // Discard the pending edit and show the committed value again —
        // the same contract Escape has inside the dialog. Stops
        // propagating so a surrounding dialog does not also close on
        // what was, to the user, a text-editing keystroke. When no edit
        // is pending the key is left alone.
        event.preventDefault();
        event.stopPropagation();
        typed.value = null;
        invalid.value = false;
    }
}

// ---------------------------------------------------------------
// Time selects
// ---------------------------------------------------------------

const pendingHour = computed(() => parseIsoTime(pendingTime.value)?.hour ?? 0);
const pendingMinute = computed(() => parseIsoTime(pendingTime.value)?.minute ?? 0);

/**
 * The hours offered.
 *
 * On a 12-hour clock this lists only the half of the day the meridiem
 * select is currently on, so the two controls together name exactly one
 * hour. Listing 1-12 once and letting the meridiem reinterpret it is the
 * same thing, but it makes "12 AM" ambiguous at precisely the point where
 * users already get it wrong.
 */
const hourOptions = computed(() => {
    const out: { value: number; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
        if (clock12.value && h < 12 !== pendingHour.value < 12) continue;
        out.push({
            value: h,
            label: clock12.value ? String(((h + 11) % 12) + 1) : pad(h),
        });
    }
    return out;
});

const minuteOptions = computed(() => {
    const out: number[] = [];
    for (let m = 0; m < 60; m += Math.max(1, props.minuteStep ?? 1)) out.push(m);
    return out;
});

function setHour(hour: number): void {
    pendingTime.value = formatIsoTime({ hour, minute: pendingMinute.value });
}

function setMinute(minute: number): void {
    pendingTime.value = formatIsoTime({ hour: pendingHour.value, minute });
}

/** Cross between AM and PM without changing the minute of the hour. */
function setMeridiem(pm: boolean): void {
    setHour((pendingHour.value % 12) + (pm ? 12 : 0));
}

function onHourChange(event: Event): void {
    setHour(Number((event.target as HTMLSelectElement).value));
}

function onMinuteChange(event: Event): void {
    setMinute(Number((event.target as HTMLSelectElement).value));
}

function onMeridiemChange(event: Event): void {
    setMeridiem((event.target as HTMLSelectElement).value === "pm");
}

// ---------------------------------------------------------------
// Void-safe click wrappers
//
// `openDialog` / `closeDialog` / `shiftMonth` / `applyShortcut` are all
// async (they `await nextTick()` before moving focus), but a template
// `@click` handler that returns a promise is a floating promise under a
// strict lint config. These small synchronous wrappers are the named-
// handler idiom the sibling helpers use throughout, rather than an inline
// `void` in the template expression.
// ---------------------------------------------------------------

function onTriggerClick(): void {
    void (open.value ? closeDialog() : openDialog());
}

function onPreviousYearClick(): void {
    shiftYear(-1);
}

function onPreviousMonthClick(): void {
    void shiftMonth(-1);
}

function onNextMonthClick(): void {
    void shiftMonth(1);
}

function onNextYearClick(): void {
    shiftYear(1);
}

function onCancelClick(): void {
    void closeDialog();
}

function onShortcutClick(shortcut: DateTimeShortcut): void {
    void applyShortcut(shortcut);
}

// ---------------------------------------------------------------
// Shortcuts
// ---------------------------------------------------------------

async function applyShortcut(shortcut: DateTimeShortcut): Promise<void> {
    const base = todayIso();
    let target = shortcut.date ?? base;
    if (shortcut.days !== undefined) target = addDays(base, shortcut.days);
    else if (shortcut.months !== undefined) {
        target = addMonths(base, shortcut.months);
    }
    // A shortcut to a blocked date does nothing rather than landing
    // somewhere near it: "+4 weeks" that quietly means "+27 days" is a
    // booking error waiting to happen.
    if (dayDisabled(target)) return;

    pendingDate.value = target;
    cursor.value = target;
    const parsed = parseIsoDate(target);
    if (parsed) {
        viewYear.value = parsed.year;
        viewMonth.value = parsed.month;
    }
    emit("shortcut", shortcut.id, target);
    if (commitOnDay.value) commit();
    else {
        await nextTick();
        focusCursor();
    }
}

// ---------------------------------------------------------------
// Outside click + first mount
// ---------------------------------------------------------------

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    const target = event.target as Node | null;
    if (!target) return;
    // Anything outside the dialog closes it — including the component's
    // own text field. The dialog says aria-modal="true", and a modal
    // that stays open while the user edits the field behind it is
    // telling assistive technology one thing and doing another. The
    // trigger button is exempt because its own handler already toggles.
    if (dialogEl.value?.contains(target) || buttonEl.value?.contains(target)) return;
    void closeDialog(false);
}

onMounted(() => {
    document.addEventListener("click", onDocumentClick);

    today.value = todayIso();
    const anchor = parseIsoDate(committed.value.date) ?? parseIsoDate(today.value);
    if (anchor) {
        viewYear.value = anchor.year;
        viewMonth.value = anchor.month;
        cursor.value = formatIsoDate(anchor);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`date-time-picker ${props.class}`.trim()"
        :data-mode="mode"
    >
        <input type="hidden" :name="name" :value="current ?? ''" />

        <div class="date-time-picker-field">
            <input
                class="date-time-picker-input"
                :id="fieldId"
                type="text"
                autocomplete="off"
                :value="display"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :required="required"
                :aria-describedby="fieldDescribedBy"
                :aria-invalid="invalid ? 'true' : undefined"
                :aria-errormessage="invalid && labels.invalid ? statusId : undefined"
                @input="onInput"
                @blur="resolveTyped"
                @keydown="onFieldKeydown"
            />

            <button
                ref="buttonEl"
                type="button"
                class="date-time-picker-button"
                :aria-label="label"
                aria-haspopup="dialog"
                :aria-expanded="open ? 'true' : 'false'"
                :aria-controls="dialogId"
                :disabled="disabled || readonly"
                @click="onTriggerClick"
            >
                <slot v-bind="{ value: current, open, display }">
                    <span class="date-time-picker-icon" aria-hidden="true"
                        >📅︎</span
                    >
                </slot>
            </button>
        </div>

        <!-- Present in the DOM before it has content: a live region that
             appears at the same moment as its message is routinely not
             announced at all. Empty while the field is valid. -->
        <span
            v-if="labels.invalid"
            class="date-time-picker-status"
            :id="statusId"
            role="status"
            >{{ invalid ? labels.invalid : "" }}</span
        >

        <div
            ref="dialogEl"
            class="date-time-picker-dialog"
            :id="dialogId"
            role="dialog"
            aria-modal="true"
            :aria-label="label"
            :aria-describedby="labels.instructions ? instructionsId : undefined"
            tabindex="-1"
            :hidden="open ? undefined : true"
            @keydown="onDialogKeydown"
        >
            <!-- Spoken once when the dialog takes focus, via the dialog's
                 aria-describedby. Visible by default; a consumer who wants
                 it screen-reader-only hides it with their own CSS. -->
            <p
                v-if="labels.instructions"
                class="date-time-picker-instructions"
                :id="instructionsId"
            >
                {{ labels.instructions }}
            </p>
            <div v-if="usesDate" class="date-time-picker-header">
                <button
                    type="button"
                    class="date-time-picker-previous-year"
                    :aria-label="labels.previousYear"
                    @click="onPreviousYearClick"
                >
                    <span aria-hidden="true">&#171;</span>
                </button>
                <button
                    type="button"
                    class="date-time-picker-previous-month"
                    :aria-label="labels.previousMonth"
                    @click="onPreviousMonthClick"
                >
                    <span aria-hidden="true">&#8249;</span>
                </button>

                <!-- Polite, not assertive: paging months is the visible
                     result of the user's own keypress, so it should reach
                     a screen reader without interrupting anything. -->
                <span class="date-time-picker-period" :id="periodId" aria-live="polite">
                    {{ periodText }}
                </span>

                <button
                    type="button"
                    class="date-time-picker-next-month"
                    :aria-label="labels.nextMonth"
                    @click="onNextMonthClick"
                >
                    <span aria-hidden="true">&#8250;</span>
                </button>
                <button
                    type="button"
                    class="date-time-picker-next-year"
                    :aria-label="labels.nextYear"
                    @click="onNextYearClick"
                >
                    <span aria-hidden="true">&#187;</span>
                </button>
            </div>

            <!-- The grid owns its own keyboard contract, which is why the
                 handler sits on the table rather than on each of 42 cells. -->
            <table
                v-if="usesDate"
                ref="gridEl"
                class="date-time-picker-calendar"
                role="grid"
                :aria-labelledby="periodId"
                @keydown="onGridKeydown"
            >
                <thead>
                    <tr>
                        <th
                            v-if="showWeekNumbers"
                            class="date-time-picker-week-heading"
                            scope="col"
                            :abbr="labels.week"
                        >
                            {{ labels.week }}
                        </th>
                        <!-- `abbr` carries the full weekday name, so a
                             screen reader announcing the column says
                             "Monday" where the eye reads "Mo". -->
                        <th
                            v-for="(weekday, i) in weekdays"
                            :key="i"
                            class="date-time-picker-weekday"
                            scope="col"
                            :abbr="weekday.long"
                        >
                            {{ weekday.short }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="week in weeks" :key="week[0]">
                        <th v-if="showWeekNumbers" class="date-time-picker-week" scope="row">
                            {{ isoWeek(week[0]) }}
                        </th>
                        <td
                            v-for="isoDate in week"
                            :key="isoDate"
                            role="gridcell"
                            :aria-selected="isoDate === pendingDate ? 'true' : 'false'"
                        >
                            <!-- aria-disabled, not `disabled`: a vetoed
                                 day must stay focusable so the roving
                                 cursor can land on it and a screen
                                 reader can announce it as unavailable.
                                 A `disabled` button refuses focus, and
                                 arrowing across a blocked week goes
                                 silent while the visible focus stays
                                 behind. Activation is refused in
                                 `selectDay` instead. -->
                            <button
                                type="button"
                                class="date-time-picker-day"
                                :data-date="isoDate"
                                :data-outside="parseIsoDate(isoDate)?.month !== viewMonth ? '' : undefined"
                                :data-today="isoDate === today ? '' : undefined"
                                :data-selected="isoDate === pendingDate ? '' : undefined"
                                :data-disabled="dayDisabled(isoDate) ? '' : undefined"
                                :tabindex="isoDate === cursor ? 0 : -1"
                                :aria-label="dayLabel(isoDate)"
                                :aria-current="isoDate === today ? 'date' : undefined"
                                :aria-disabled="dayDisabled(isoDate) ? 'true' : undefined"
                                @click="selectDay(isoDate)"
                            >
                                {{ parseIsoDate(isoDate)?.day ?? "" }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="usesTime" class="date-time-picker-time">
                <label class="date-time-picker-time-label" :for="hourId">
                    {{ labels.hour }}
                </label>
                <select
                    class="date-time-picker-hour"
                    :id="hourId"
                    :value="pendingHour"
                    @change="onHourChange"
                >
                    <option v-for="option in hourOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>

                <label class="date-time-picker-time-label" :for="minuteId">
                    {{ labels.minute }}
                </label>
                <select
                    class="date-time-picker-minute"
                    :id="minuteId"
                    :value="pendingMinute"
                    @change="onMinuteChange"
                >
                    <option v-for="minute in minuteOptions" :key="minute" :value="minute">
                        {{ pad(minute) }}
                    </option>
                </select>

                <template v-if="clock12">
                    <label class="date-time-picker-time-label" :for="meridiemId">
                        {{ labels.meridiem }}
                    </label>
                    <select
                        class="date-time-picker-meridiem"
                        :id="meridiemId"
                        :value="pendingHour >= 12 ? 'pm' : 'am'"
                        @change="onMeridiemChange"
                    >
                        <!-- Stable values, localised labels: the visible
                             text is the locale's own day-period name. -->
                        <option value="am">{{ dayPeriodName(false) }}</option>
                        <option value="pm">{{ dayPeriodName(true) }}</option>
                    </select>
                </template>
            </div>

            <div v-if="shortcuts.length > 0" class="date-time-picker-shortcuts">
                <button
                    v-for="shortcut in shortcuts"
                    :key="shortcut.id"
                    type="button"
                    class="date-time-picker-shortcut"
                    :data-shortcut-id="shortcut.id"
                    @click="onShortcutClick(shortcut)"
                >
                    {{ shortcut.label }}
                </button>
            </div>

            <div class="date-time-picker-footer">
                <button v-if="labels.clear" type="button" class="date-time-picker-clear" @click="clear">
                    {{ labels.clear }}
                </button>
                <button type="button" class="date-time-picker-cancel" @click="onCancelClick">
                    {{ labels.cancel }}
                </button>
                <button type="button" class="date-time-picker-confirm" @click="commit">
                    {{ labels.confirm }}
                </button>
            </div>
        </div>
    </div>
</template>
