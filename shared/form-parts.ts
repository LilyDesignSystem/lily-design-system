// The rules of four form parts the mobile catalogs draw natively (tasks.md P62-T3): date-field, quantity-input-div,
// repeatable-fieldset and step-list. The web components keep these rules inline; this module states them once, with the same
// results, so the Swift, Kotlin and .NET MAUI ports can prove they behave alike through shared/vectors/form-parts.json.
//
// Checked arithmetic: an input outside its valid range is an error (FormPartsError, with a reason), never clamped or defaulted.

export type DatePart = "year" | "month" | "day";
export type DatePrecision = "day" | "month" | "year";
export type DateOrder = "ymd" | "dmy" | "mdy";
export type DateParts = Record<DatePart, string>;

export type FormPartsReason = "precision" | "order" | "count" | "limit" | "index";

export class FormPartsError extends RangeError {
    readonly reason: FormPartsReason;
    constructor(reason: FormPartsReason, message: string) {
        super(message);
        this.name = "FormPartsError";
        this.reason = reason;
    }
}

const SHOWN: Record<DatePrecision, DatePart[]> = {
    day: ["year", "month", "day"],
    month: ["year", "month"],
    year: ["year"],
};
const SEQUENCES: Record<DateOrder, DatePart[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

function shownFor(precision: DatePrecision): DatePart[] {
    const shown = SHOWN[precision];
    if (!shown)
        throw new FormPartsError(
            "precision",
            `precision ${String(precision)} is not day, month or year`,
        );
    return shown;
}

/** The parts a date field asks for at a precision, in ISO 8601 order. */
export function datePartsShown(precision: DatePrecision): DatePart[] {
    return [...shownFor(precision)];
}

/** The parts in the order the reader writes them, leaving out those the precision does not ask for. */
export function dateSequence(order: DateOrder, precision: DatePrecision): DatePart[] {
    const sequence = SEQUENCES[order];
    if (!sequence)
        throw new FormPartsError("order", `order ${String(order)} is not ymd, dmy or mdy`);
    const shown = shownFor(precision);
    return sequence.filter((part) => shown.includes(part));
}

/** The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else. */
export function splitDateValue(value: string, precision: DatePrecision): DateParts {
    const shown = shownFor(precision);
    const m = /^(\d{1,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/.exec(value);
    const filled = m ? [m[1], m[2], m[3]].filter((x) => x !== undefined).length : 0;
    if (!m || filled !== shown.length) return { year: "", month: "", day: "" };
    return { year: m[1], month: m[2] ?? "", day: m[3] ?? "" };
}

/** The value once every part asked for is a number, padded to ISO 8601, else "". The calendar check is isCalendarDate's. */
export function joinDateParts(parts: DateParts, precision: DatePrecision): string {
    const shown = shownFor(precision);
    if (!shown.every((part) => /^\d+$/.test(parts[part]))) return "";
    const iso = [
        parts.year.padStart(4, "0"),
        parts.month.padStart(2, "0"),
        parts.day.padStart(2, "0"),
    ];
    return iso.slice(0, shown.length).join("-");
}

/** Whether a value (YYYY, YYYY-MM or YYYY-MM-DD) names a real year, month or day in the Gregorian calendar. */
export function isCalendarDate(value: string): boolean {
    const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value);
    if (!m) return false;
    const year = Number(m[1]);
    if (m[2] === undefined) return true;
    const month = Number(m[2]);
    if (month < 1 || month > 12) return false;
    if (m[3] === undefined) return true;
    const day = Number(m[3]);
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    return day >= 1 && day <= days;
}

export type QuantityProblem = "empty" | "not-a-number" | "below-minimum" | "above-maximum";

/**
 * What is wrong with a magnitude as typed, against its unit's limits, or null when nothing is. The number is written with a full
 * stop for its decimal mark, as an HTML number input gives it; a field that takes a locale's own mark converts it first.
 */
export function quantityProblem(
    magnitude: string,
    min: number | null,
    max: number | null,
): QuantityProblem | null {
    if (min !== null && !Number.isFinite(min))
        throw new FormPartsError("limit", `min ${String(min)} is not a finite number`);
    if (max !== null && !Number.isFinite(max))
        throw new FormPartsError("limit", `max ${String(max)} is not a finite number`);
    if (min !== null && max !== null && min > max)
        throw new FormPartsError("limit", `min ${min} is above max ${max}`);
    const text = magnitude.trim();
    if (text === "") return "empty";
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(text)) return "not-a-number";
    const n = Number(text);
    if (min !== null && n < min) return "below-minimum";
    if (max !== null && n > max) return "above-maximum";
    return null;
}

function checkCount(count: number): void {
    if (!Number.isInteger(count) || count < 0)
        throw new FormPartsError("count", `count ${String(count)} is not a whole number of items`);
}

function checkLimit(limit: number, name: string): void {
    if (!Number.isInteger(limit) || limit < 0)
        throw new FormPartsError("limit", `${name} ${String(limit)} is not a whole number`);
}

/** Whether a repeatable fieldset may add another item: below its maximum, or always when it has none. */
export function canAddItem(count: number, max: number | null): boolean {
    checkCount(count);
    if (max === null) return true;
    checkLimit(max, "max");
    return count < max;
}

/** Whether a repeatable fieldset may remove an item: above its minimum. */
export function canRemoveItem(count: number, min: number): boolean {
    checkCount(count);
    checkLimit(min, "min");
    return count > min;
}

export type StepStatus = "finished" | "in-progress" | "waiting";

/** A step's status from its index and the current step's: before it finished, at it in progress, after it waiting. */
export function stepStatus(index: number, current: number): StepStatus {
    if (!Number.isInteger(index) || index < 0)
        throw new FormPartsError("index", `index ${String(index)} is not a step`);
    if (!Number.isInteger(current) || current < 0)
        throw new FormPartsError("index", `current ${String(current)} is not a step`);
    return index < current ? "finished" : index === current ? "in-progress" : "waiting";
}
