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
 *   formatQuantity(5, "mmol/L", "en-GB", "<") "<5 mmol/L" (FHIR Quantity.comparator: <, <=, >=, >; never dropped)
 *   formatQuantity(3, "kg", "en-GB", "~")      "≈3 kg"     (openEHR magnitude_status "~": approximate, never read as exact)
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
 *
 *   formatPartialDate("2019", "en-GB")       "2019"            (openEHR DV_DATE partial forms, FHIR partial dates:
 *   formatPartialDate("2019-03", "en-GB")    "March 2019"       only the fields the record has, never an invented
 *   formatPartialDate("2019-03-14", "en-GB") "14 March 2019"    day or month; the month is always a word)
 *   partialDatePrecision("2019-03")          "month"
 *
 *   formatProportion(1, 128, "ratio", "en-GB")            "1:128"   (openEHR DV_PROPORTION and its five kinds)
 *   formatProportion(3, 2, "integer-fraction", "en-GB")   "1 1/2"
 *   formatProportion(45, 100, "percent", "fr-FR")         "45 %" (the locale's own space)
 */

/**
 * FHIR Quantity.comparator, plus openEHR's "~" (approximately, from DV_QUANTIFIED.magnitude_status). A result of "<5" is not
 * a result of "5", and "about 3 kg" is not "3 kg", so the comparator is never dropped.
 */

const COMPARATOR_SIGN                                     = {
    "<": "<",
    "<=": "≤",
    ">=": "≥",
    ">": ">",
    "~": "≈",
};

const NO_BREAK_SPACE = " ";
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * A quantity and its unit, written the safe way: no trailing zero, a leading zero, grouping, a no-break space. A comparator
 * is written before the number as <, ≤, ≥, > or ≈, with no space.
 */
export function formatQuantity(
    value        ,
    unit        ,
    locale        ,
    comparator                     ,
)         {
    if (!Number.isFinite(value))
        throw new RangeError("formatQuantity: value must be a finite number");
    if (!locale) throw new RangeError("formatQuantity: a locale is required");
    if (
        comparator !== undefined &&
        !Object.prototype.hasOwnProperty.call(COMPARATOR_SIGN, comparator)
    )
        throw new RangeError(`formatQuantity: not a comparator: ${String(comparator)}`);
    // maximumFractionDigits keeps every digit the caller gave; Intl never writes trailing zeros and always writes a leading one.
    const number = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 20,
        useGrouping: true,
    }).format(value);
    const written = comparator ? `${COMPARATOR_SIGN[comparator]}${number}` : number;
    return unit ? `${written}${NO_BREAK_SPACE}${unit}` : written;
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

/** How much of a date a partial ISO 8601 date holds. */

const PARTIAL_DATE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

function parsePartialDate(iso        )                                                 {
    const match = PARTIAL_DATE.exec(iso);
    if (!match)
        throw new RangeError(`not a partial date (YYYY, YYYY-MM or YYYY-MM-DD): ${String(iso)}`);
    const year = Number(match[1]);
    const month = match[2] === undefined ? undefined : Number(match[2]);
    const day = match[3] === undefined ? undefined : Number(match[3]);
    if (month !== undefined && (month < 1 || month > 12))
        throw new RangeError(`not a month: ${String(iso)}`);
    if (day !== undefined && (day < 1 || day > daysInMonth(year, (month          ) - 1)))
        throw new RangeError(`not a day of that month: ${String(iso)}`);
    return { year, month, day };
}

/** "year", "month" or "day": how precise a partial date (YYYY, YYYY-MM or YYYY-MM-DD) is. */
export function partialDatePrecision(iso        )                {
    const { month, day } = parsePartialDate(iso);
    if (day !== undefined) return "day";
    if (month !== undefined) return "month";
    return "year";
}

/**
 * A partial date written with only the fields it has, through Intl.DateTimeFormat: a year alone, a month and year, or a full
 * date. The month is a word ("long" by default, or "short"), never a number, so 03/04 can never be misread. It never adds a
 * day or a month the record does not have. Calendar dates have no time zone, so they are formatted in UTC.
 */
export function formatPartialDate(
    iso        ,
    locale        ,
    options                               = {},
)         {
    if (!locale) throw new RangeError("formatPartialDate: a locale is required");
    const { year, month, day } = parsePartialDate(iso);
    const date = new Date(Date.UTC(2000, (month ?? 1) - 1, day ?? 1));
    date.setUTCFullYear(year);
    return new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        year: "numeric",
        ...(month !== undefined ? { month: options.month ?? "long" } : {}),
        ...(day !== undefined ? { day: "numeric" } : {}),
    }).format(date);
}

/** openEHR PROPORTION_KIND: how a numerator and denominator are written. */

/**
 * A proportion written as its kind says: a ratio "1:128", a unitary value (denominator 1) "0.5", a percent (denominator 100)
 * "45%" in the locale's form, a fraction "1/2", or an integer fraction "1 1/2". Numbers go through Intl.NumberFormat. It
 * reduces nothing: 2/4 stays 2/4, since the record said 2/4.
 */
export function formatProportion(
    numerator        ,
    denominator        ,
    kind                ,
    locale        ,
)         {
    if (!locale) throw new RangeError("formatProportion: a locale is required");
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator))
        throw new RangeError("formatProportion: numerator and denominator must be finite numbers");
    const number = (value        ) =>
        new Intl.NumberFormat(locale, { maximumFractionDigits: 20, useGrouping: true }).format(
            value,
        );
    switch (kind) {
        case "ratio":
            if (denominator === 0)
                throw new RangeError("formatProportion: a ratio needs a denominator");
            return `${number(numerator)}:${number(denominator)}`;
        case "unitary":
            if (denominator !== 1)
                throw new RangeError("formatProportion: a unitary proportion has denominator 1");
            return number(numerator);
        case "percent":
            if (denominator !== 100)
                throw new RangeError("formatProportion: a percent has denominator 100");
            return new Intl.NumberFormat(locale, {
                style: "percent",
                maximumFractionDigits: 20,
            }).format(numerator / 100);
        case "fraction":
        case "integer-fraction": {
            if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator <= 0)
                throw new RangeError(
                    "formatProportion: a fraction needs a whole numerator and a positive whole denominator",
                );
            if (kind === "fraction") return `${number(numerator)}/${number(denominator)}`;
            const sign = numerator < 0 ? "-" : "";
            const whole = Math.floor(Math.abs(numerator) / denominator);
            const rest = Math.abs(numerator) % denominator;
            if (rest === 0) return `${sign}${number(whole)}`;
            if (whole === 0) return `${sign}${number(rest)}/${number(denominator)}`;
            return `${sign}${number(whole)}${NO_BREAK_SPACE}${number(rest)}/${number(denominator)}`;
        }
        default:
            throw new RangeError(`formatProportion: not a proportion kind: ${String(kind)}`);
    }
}
