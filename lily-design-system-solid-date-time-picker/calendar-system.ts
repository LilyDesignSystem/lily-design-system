/**
 * Month grids in any CLDR calendar (`persian`, `islamic-umalqura`, `buddhist`, `hebrew`, ...), with no dependency and no
 * calendar arithmetic of our own: `Intl.DateTimeFormat` says which day of its month a date is, and a month is the run of
 * days from one day 1 to the next. That holds for lunar months and for leap months alike.
 *
 * Every date in and out is an ISO Gregorian `YYYY-MM-DD`, so a form value never changes shape. A month is named by the
 * ISO date of its first day. With no calendar, or `gregory`, the module takes the same path and agrees with plain
 * Gregorian paging. Spec: spec/date-time-picker/index.md#calendar-systems.
 */

const DAY_MS = 86400000;

const toMs = (iso: string): number => Date.parse(`${iso}T00:00:00Z`);
const toIso = (ms: number): string => new Date(ms).toISOString().slice(0, 10);
const shift = (iso: string, days: number): string => toIso(toMs(iso) + days * DAY_MS);

const formatters = new Map<string, Intl.DateTimeFormat>();

function dayFormatter(calendar: string): Intl.DateTimeFormat {
    let formatter = formatters.get(calendar);
    if (!formatter) {
        // English numerals here only so the digits parse; nothing from this formatter is shown to anyone.
        formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}-nu-latn`, {
            day: "numeric",
            timeZone: "UTC",
        });
        formatters.set(calendar, formatter);
    }
    return formatter;
}

/** The day of the month in `calendar`, 1-based. */
export function calendarDay(iso: string, calendar = "gregory"): number {
    const part = dayFormatter(calendar)
        .formatToParts(new Date(toMs(iso)))
        .find((p) => p.type === "day");
    return Number(part?.value);
}

/** The first day of the month holding `iso`. */
export function calendarMonthStart(iso: string, calendar = "gregory"): string {
    return shift(iso, 1 - calendarDay(iso, calendar));
}

/** How many days the month starting on `start` has. */
export function calendarMonthLength(start: string, calendar = "gregory"): number {
    // Counted from 1: Ethiopic and Coptic have a thirteenth month of five or six days.
    for (let length = 1; length < 40; length++) {
        if (calendarDay(shift(start, length), calendar) === 1) return length;
    }
    throw new RangeError(`calendar-system: no month end after ${start} in ${calendar}`);
}

/** The first day of the month `delta` months after the one starting on `start`. */
export function calendarAddMonths(start: string, delta: number, calendar = "gregory"): string {
    let month = start;
    for (let i = 0; i < delta; i++) month = shift(month, calendarMonthLength(month, calendar));
    for (let i = 0; i > delta; i--) month = calendarMonthStart(shift(month, -1), calendar);
    return month;
}

/** Six rows of seven ISO dates holding the month, starting on `firstDayOfWeek` (0 = Sunday). */
export function calendarMonthMatrix(
    start: string,
    firstDayOfWeek: number,
    calendar = "gregory",
): string[][] {
    const weekday = new Date(toMs(start)).getUTCDay();
    let date = shift(start, -((weekday - firstDayOfWeek + 7) % 7));
    const rows: string[][] = [];
    for (let row = 0; row < 6; row++) {
        const days: string[] = [];
        for (let column = 0; column < 7; column++) {
            days.push(date);
            date = shift(date, 1);
        }
        rows.push(days);
    }
    return rows;
}

/** `locale` with `calendar` set on it, for headings and day labels. No calendar or a bad tag gives the locale back. */
export function calendarLocale(
    locale: string | undefined,
    calendar = "gregory",
): string | undefined {
    if (!locale) return locale;
    try {
        return new Intl.Locale(locale, { calendar }).toString();
    } catch {
        return locale;
    }
}
