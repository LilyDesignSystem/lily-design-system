/**
 * The labels a label pack cannot hold because they depend on how a locale writes dates: weekday and day names,
 * the announced period, the Gantt column headings, and the date-time picker's navigation names. They come from
 * `Intl`, so they are right for every locale the browser has data for, and a label the browser cannot build is
 * left out (the control stays unnamed, as with a pack key a locale lacks) rather than shown in another language.
 *
 * `intlLabelsFor` is `labelsFor` plus these: pass it the helper, the pack and the locale tag.
 *
 *   const labels = intlLabelsFor("calendar", pack, "cy-gb");
 */
import { labelsFor, type LabelHelper, type LabelPack } from "./label-pack.js";

/** The labels `Intl` builds, per helper (data-grid, kanban-board and filter have none). */
export type IntlLabels = Record<string, unknown>;

/** The date-time picker's labels, in the shape the Gantt chart and calendar take. */
export type DateTimePickerLabels = {
    previousYear?: string;
    previousMonth?: string;
    previousWeek?: string;
    previousDay?: string;
    nextDay?: string;
    nextWeek?: string;
    nextMonth?: string;
    nextYear?: string;
    confirm?: string;
    cancel?: string;
};

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** A known Sunday, plus `wd` days: the way to turn a weekday number (0 = Sunday) into a date `Intl` can name. */
const weekdayDate = (wd: number) => new Date(Date.UTC(2023, 0, 1 + wd));

function supported(locale: string): boolean {
    try {
        return Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0;
    } catch {
        return false;
    }
}

const upperFirst = (text: string, locale: string) => {
    const [first, ...rest] = Array.from(text);
    return first === undefined ? text : first.toLocaleUpperCase(locale) + rest.join("");
};

/**
 * The date-time picker's navigation labels from `Intl.RelativeTimeFormat` ("last month", "next year", "yesterday"),
 * which every locale the browser knows has; `confirm` and `cancel` are words, so they come from the caller (the
 * Gantt chart's own save and cancel labels do). A navigation label the browser cannot build is left out.
 */
export function intlDateTimePickerLabels(locale: string, words: { confirm?: string; cancel?: string } = {}): DateTimePickerLabels {
    const out: DateTimePickerLabels = {};
    if (words.confirm !== undefined) out.confirm = words.confirm;
    if (words.cancel !== undefined) out.cancel = words.cancel;
    if (typeof Intl.RelativeTimeFormat !== "function" || !supported(locale)) return out;
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const rel = (n: number, unit: Intl.RelativeTimeFormatUnit) => upperFirst(rtf.format(n, unit), locale);
    return {
        ...out,
        previousYear: rel(-1, "year"),
        previousMonth: rel(-1, "month"),
        previousWeek: rel(-1, "week"),
        previousDay: rel(-1, "day"),
        nextDay: rel(1, "day"),
        nextWeek: rel(1, "week"),
        nextMonth: rel(1, "month"),
        nextYear: rel(1, "year"),
    };
}

/** The `Intl`-built labels for one helper in one locale. */
export function intlLabels(helper: LabelHelper, locale: string, pack?: LabelPack): IntlLabels {
    if (!supported(locale)) return {};
    const long = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
    const short = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const full = new Intl.DateTimeFormat(locale, { dateStyle: "full", timeZone: "UTC" });
    const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
    if (helper === "calendar") {
        return {
            weekday: (wd: number) => long.format(weekdayDate(wd)),
            weekdayAbbr: (wd: number) => short.format(weekdayDate(wd)),
            day: (iso: string) => full.format(utc(iso)),
            periodAnnouncement: (_view: string, start: string, end: string) => `${full.format(utc(start))} – ${full.format(utc(end))}`,
        };
    }
    if (helper === "gantt-chart") {
        const merged = pack ? labelsFor("gantt-chart", pack) : {};
        return {
            columnLabel: (start: string) => day.format(utc(start)),
            dateTimePickerLabels: intlDateTimePickerLabels(locale, {
                confirm: typeof merged.saveLabel === "string" ? merged.saveLabel : undefined,
                cancel: typeof merged.cancelLabel === "string" ? merged.cancelLabel : undefined,
            }),
        };
    }
    return {};
}

/** `labelsFor` plus the `Intl`-built labels: everything a helper needs for a locale, from its pack and the browser. */
export function intlLabelsFor(helper: LabelHelper, pack: LabelPack, locale: string): Record<string, unknown> {
    return { ...labelsFor(helper, pack), ...intlLabels(helper, locale, pack) };
}
