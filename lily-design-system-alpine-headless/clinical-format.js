// Generated from shared/clinical-format.ts by bin/sync-shared-modules; edit the shared module, never this copy.
/**
 * Clinical display formatting (spec/healthcare-ui, tasks.md P27-T1). Pure and framework-neutral: no DOM, no clinical judgement.
 *
 * These functions decide how a value is written, never what the value is. They do not convert units, round a dose, compute a
 * score or a reference range, or choose a locale: the caller supplies every one of those.
 *
 *   formatQuantity(5, "mg", "en-GB")   "5 mg"        (no trailing zero: never "5.0 mg")
 *   formatQuantity(0.5, "mg", "de-DE") "0,5 mg"      (always a leading zero: never ".5 mg")
 *   formatQuantity(5000, "units", "en") "5,000 units" (grouping, so 5000 and 500 are not confused)
 *
 * The number and unit are joined by a no-break space (U+00A0), so a line break can never separate a dose from its unit.
 * The rules are those of ISMP's guidelines for electronic communication of medication information, which the Australian and
 * Canadian guidance share.
 *
 *   ageParts(birth, at)   the age in the unit bands of the NHS Common User Interface's age display:
 *     under 2 hours: minutes; under 2 days: hours; under 4 weeks: days; under 1 year: weeks and days;
 *     under 2 years: months and days; under 18 years: years and months; from 18: years.
 *   toIsoDuration(parts)  the same age as an ISO 8601 duration ("P5Y2M", "P23D", "PT90M"), for a machine-readable attribute.
 *
 * ageParts returns numbers and unit keys, never words: format them with Intl.DurationFormat or the consumer's own labels. The
 * bands are one national convention; a consumer with another can ignore ageParts and pass its own text.
 */

const NO_BREAK_SPACE = " ";
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A quantity and its unit, written the safe way: no trailing zero, a leading zero, grouping, a no-break space. */
export function formatQuantity(value        , unit        , locale        )         {
    if (!Number.isFinite(value))
        throw new RangeError("formatQuantity: value must be a finite number");
    if (!locale) throw new RangeError("formatQuantity: a locale is required");
    // maximumFractionDigits keeps every digit the caller gave; Intl never writes trailing zeros and always writes a leading one.
    const number = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 20,
        useGrouping: true,
    }).format(value);
    return unit ? `${number}${NO_BREAK_SPACE}${unit}` : number;
}

function toDate(value               )       {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        throw new RangeError(`ageParts: not a date: ${String(value)}`);
    return date;
}

function daysInMonth(year        , monthIndex        )         {
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** Whole calendar years, months and days from `birth` to `at`, in UTC. */
function calendarDifference(
    birth      ,
    at      ,
)                                                  {
    let years = at.getUTCFullYear() - birth.getUTCFullYear();
    let months = at.getUTCMonth() - birth.getUTCMonth();
    let days = at.getUTCDate() - birth.getUTCDate();
    const atTime =
        at.getUTCHours() * HOUR +
        at.getUTCMinutes() * MINUTE +
        at.getUTCSeconds() * 1000 +
        at.getUTCMilliseconds();
    const birthTime =
        birth.getUTCHours() * HOUR +
        birth.getUTCMinutes() * MINUTE +
        birth.getUTCSeconds() * 1000 +
        birth.getUTCMilliseconds();
    if (atTime < birthTime) days -= 1;
    if (days < 0) {
        months -= 1;
        const previousMonth = (at.getUTCMonth() + 11) % 12;
        const previousYear = previousMonth === 11 ? at.getUTCFullYear() - 1 : at.getUTCFullYear();
        days += daysInMonth(previousYear, previousMonth);
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    return { years, months, days };
}

/** The age at `at` of someone born at `birth`, in the Common User Interface's unit bands. */
export function ageParts(birth               , at               )            {
    const from = toDate(birth);
    const to = toDate(at);
    const elapsed = to.getTime() - from.getTime();
    if (elapsed < 0) throw new RangeError("ageParts: `at` is before `birth`");
    if (elapsed < 2 * HOUR) return [{ value: Math.floor(elapsed / MINUTE), unit: "minutes" }];
    if (elapsed < 2 * DAY) return [{ value: Math.floor(elapsed / HOUR), unit: "hours" }];
    const totalDays = Math.floor(elapsed / DAY);
    if (totalDays < 28) return [{ value: totalDays, unit: "days" }];
    const { years, months, days } = calendarDifference(from, to);
    if (years < 1) {
        return [
            { value: Math.floor(totalDays / 7), unit: "weeks" },
            { value: totalDays % 7, unit: "days" },
        ];
    }
    if (years < 2) {
        return [
            { value: years * 12 + months, unit: "months" },
            { value: days, unit: "days" },
        ];
    }
    if (years < 18) {
        return [
            { value: years, unit: "years" },
            { value: months, unit: "months" },
        ];
    }
    return [{ value: years, unit: "years" }];
}

/** Age parts as an ISO 8601 duration. Weeks are written as days, since ISO 8601 does not combine weeks with other units. */
export function toIsoDuration(parts           )         {
    let years = 0;
    let months = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    for (const part of parts) {
        if (part.unit === "years") years += part.value;
        else if (part.unit === "months") months += part.value;
        else if (part.unit === "weeks") days += part.value * 7;
        else if (part.unit === "days") days += part.value;
        else if (part.unit === "hours") hours += part.value;
        else minutes += part.value;
    }
    const date = `${years ? `${years}Y` : ""}${months ? `${months}M` : ""}${days ? `${days}D` : ""}`;
    const time = `${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}`;
    if (!date && !time) return "PT0M";
    return `P${date}${time ? `T${time}` : ""}`;
}
