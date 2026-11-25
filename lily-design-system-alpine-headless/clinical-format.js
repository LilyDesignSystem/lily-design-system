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
 *   formatRange(3.5, 5.5, "mmol/L", "en-GB")   "3.5–5.5 mmol/L" (low to high, always; a range given backwards is refused)
 *   formatQuantity(1.5, "mmol/L", "en-GB", undefined, { precision: 2 }) "1.50 mmol/L" (a result keeps the places reported;
 *                                                                     openEHR DV_QUANTITY.precision; never for a dose)
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
 *   htmlDuration("-P3DT4H")  { datetime: "P3DT4H", negative: true }  (a valid HTML <time datetime> duration, sign apart)
 *   durationParts("P1Y2M3D")  { years: 1, months: 2, days: 3, … }   (for Intl.DurationFormat, which writes the words)
 *
 *   formatProportion(45, 100, "percent", "fr-FR")         "45 %" (the locale's own space)
 *
 *   meterScale(5.2, 3.5, 5.5)  { min: 2.5, max: 6.5, low: 3.5, high: 5.5 }  (the scale for observation-view's meter: half a range
 *                                                                          beyond each end of a two-sided range)
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
 * How many decimal places to write. openEHR DV_QUANTITY.precision: the places the source reported, so a result of 1.50 mmol/L
 * keeps its second place. Leave it out for a dose, which must never have a trailing zero ("1.0 mg" reads as "10 mg").
 */

/** The most decimal places a formatter here writes; a value that needs more is refused, never rounded (even to zero). */
const MAX_PLACES = 20;

/** How many decimal places the shortest text of a finite number has: 2 for 0.25, 21 for 1e-21. */
function placesOf(value        )         {
    const [mantissa, exponent = "0"] = String(value).split("e");
    return Math.max(0, (mantissa.split(".")[1] ?? "").length - Number(exponent));
}

function requireWritable(value        )       {
    if (placesOf(value) > MAX_PLACES)
        throw new RangeError("the value is too fine to write exactly");
}

function decimalPlaces(value        , precision                    )                           {
    requireWritable(value);
    if (precision === undefined) return { maximumFractionDigits: MAX_PLACES };
    if (!Number.isInteger(precision) || precision < 0 || precision > 20)
        throw new RangeError("precision must be a whole number from 0 to 20");
    // A value with more places than its precision would have to be rounded, which changes the value: refuse it instead.
    if (Number(value.toFixed(precision)) !== value)
        throw new RangeError("the value has more decimal places than its precision");
    return { minimumFractionDigits: precision, maximumFractionDigits: precision };
}

/**
 * A quantity and its unit, written the safe way: no trailing zero, a leading zero, grouping, a no-break space. A comparator
 * is written before the number as <, ≤, ≥, > or ≈, with no space. With `precision`, exactly that many decimal places.
 *
 * Writes any finite number of up to 20 decimal places. One with more is a RangeError, since Intl would round it (1e-21 to 0):
 * show the record's own text instead, which every `value` prop takes as it is.
 */
export function formatQuantity(
    value        ,
    unit        ,
    locale        ,
    comparator                     ,
    options                  = {},
)         {
    if (!Number.isFinite(value))
        throw new RangeError("formatQuantity: value must be a finite number");
    if (!locale) throw new RangeError("formatQuantity: a locale is required");
    if (
        comparator !== undefined &&
        !Object.prototype.hasOwnProperty.call(COMPARATOR_SIGN, comparator)
    )
        throw new RangeError("formatQuantity: not a comparator FHIR or openEHR defines");
    // Without a precision, maximumFractionDigits keeps every digit the caller gave; Intl never writes trailing zeros and always
    // writes a leading one.
    const number = new Intl.NumberFormat(locale, {
        ...decimalPlaces(value, options.precision),
        useGrouping: true,
    }).format(value);
    const written = comparator ? `${COMPARATOR_SIGN[comparator]}${number}` : number;
    return unit ? `${written}${NO_BREAK_SPACE}${unit}` : written;
}

/**
 * A range of a quantity, low to high, with its unit after the high end: "3.5–5.5 mmol/L". The locale writes the dash and its
 * spacing (Intl.NumberFormat.formatRange). A low above the high is refused rather than written, so a range can never read
 * backwards ("2.12–1.82"). Equal ends are one number: Intl would write "~5", which reads as approximate.
 */
export function formatRange(
    low        ,
    high        ,
    unit        ,
    locale        ,
    options                  = {},
)         {
    if (!Number.isFinite(low) || !Number.isFinite(high))
        throw new RangeError("formatRange: low and high must be finite numbers");
    if (!locale) throw new RangeError("formatRange: a locale is required");
    if (low > high)
        throw new RangeError("formatRange: low is above high, so the range would read backwards");
    decimalPlaces(low, options.precision);
    const format = new Intl.NumberFormat(locale, {
        ...decimalPlaces(high, options.precision),
        useGrouping: true,
    });
    // formatRange is ES2023; some packages' TypeScript lib settings predate it, though every supported runtime has it.
    const ranged = format

     ;
    const written = low === high ? format.format(low) : ranged.formatRange(low, high);
    return unit ? `${written}${NO_BREAK_SPACE}${unit}` : written;
}

/** The scale of an `observation-view` meter: its `meterMin` and `meterMax`, and the range's `meterLow` and `meterHigh`. */

const finite = (n         )              => typeof n === "number" && Number.isFinite(n);

/** Why `meterScale` refused its input. */

/** Thrown by `meterScale` for an input that is malformed or out of range: invalid data is an error, never a quiet "no meter". */
export class MeterScaleError extends RangeError {
             reason                  ;
    constructor(reason                  , message        ) {
        super(`meterScale: ${message}`);
        this.name = "MeterScaleError";
        this.reason = reason;
    }
}

/**
 * A meter's scale for a value and its reference range, so every consumer draws the same one. It is a drawing decision, never a
 * clinical one: it says where the ends of the bar go, not whether the value is normal.
 *
 * - A two-sided range (`low` and `high`): the bar runs half a range beyond each end, so the range is the middle half of the bar.
 * - A one-sided range (only `high`, or only `low`, as in "< 5.0" or "> 60"): the bar runs from zero to half as far again as the
 *   bound.
 * - Always wide enough to hold the value, so a value far outside the range still sits on the bar.
 * - `undefined` (draw no meter) only when there is nothing to draw: no value (`null` or `undefined`, a result not yet in) or no
 *   reference range (neither end given).
 * - A `MeterScaleError` for malformed input, never a fallback: a value that is not a finite number, an end of the range that is
 *   given but not a finite number, a two-sided range that is reversed or has no width, a one-sided bound that is not above zero
 *   (the scale would not be drawn from zero), or `units` that name two different units for the value and the range (a meter
 *   must never compare millimoles with milligrams). Its `reason` says which.
 *
 * `units` is optional and only compared: pass the value's unit and the range's, as written, and a difference is an error.
 */
export function meterScale(
    value                           ,
    low                ,
    high                ,
    units                                                   ,
)                         {
    const hasLow = low !== undefined && low !== null;
    const hasHigh = high !== undefined && high !== null;
    if (value === undefined || value === null || (!hasLow && !hasHigh)) return undefined;
    if (!finite(value)) throw new MeterScaleError("value", "the value is not a finite number");
    if ((hasLow && !finite(low)) || (hasHigh && !finite(high)))
        throw new MeterScaleError("range", "an end of the range is not a finite number");
    if (units?.value && units?.range && units.value !== units.range)
        // Never the units themselves: they are free text, and a mis-mapped field could put anything in them.
        throw new MeterScaleError("units", "the value and the range are in different units");

    let min        ;
    let max        ;
    if (finite(low) && finite(high)) {
        if (low >= high)
            throw new MeterScaleError("reversed", "the range is reversed or has no width");
        const half = (high - low) / 2;
        min = low - half;
        max = high + half;
    } else {
        const bound = (finite(high) ? high : low)          ;
        if (bound <= 0) throw new MeterScaleError("bound", "a one-sided bound must be above zero");
        min = 0;
        max = bound * 1.5;
    }
    const scale             = { min: Math.min(min, value), max: Math.max(max, value) };
    if (finite(low)) scale.low = low;
    if (finite(high)) scale.high = high;
    return scale;
}

const CIVIL_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIMESTAMP =
    /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:(?:0\d|1[0-3]):[0-5]\d|14:00))$/;

/** A moment, and the calendar day it was written with. A date with no time is its day alone. */

const dayOf = (iso        )         => {
    const { year, month, day } = parsePartialDate(iso);
    const date = new Date(Date.UTC(2000, (month          ) - 1, day));
    return date.setUTCFullYear(year);
};

// No UTC offset is beyond 14:00. A year, or a year and month, has no age: JavaScript would read "2025" as 1 January and give an exact one. A time with no
// offset is a different moment in each zone. Both are refused, and the message never holds the date.
function toMoment(value               )         {
    if (value instanceof Date) {
        const time = value.getTime();
        if (Number.isNaN(time)) throw new RangeError("ageParts: not a date");
        return { time, day: Math.floor(time / DAY) * DAY, dateOnly: false };
    }
    if (typeof value === "string" && CIVIL_DATE.test(value)) {
        const day = dayOf(value);
        return { time: day, day, dateOnly: true };
    }
    if (typeof value === "string" && TIMESTAMP.test(value))
        return { day: dayOf(value.slice(0, 10)), time: Date.parse(value), dateOnly: false };
    throw new RangeError(
        "ageParts: birth and at must each be a full date (YYYY-MM-DD) or a timestamp with an offset",
    );
}

function daysInMonth(year        , monthIndex        )         {
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/**
 * Whole calendar years, months and days from `birth` to `at`, in UTC. Whole months are counted from `birth`, a day past the end
 * of a shorter month landing on its last day (31 January plus one month is 28 or 29 February); the days are those left after
 * the last whole month, so they are never negative. A time of day earlier than the time of birth has not completed its day.
 */
function calendarDifference(
    birth      ,
    at      ,
)                                                  {
    const timeOfDay = (d      ) =>
        d.getUTCHours() * HOUR +
        d.getUTCMinutes() * MINUTE +
        d.getUTCSeconds() * 1000 +
        d.getUTCMilliseconds();
    const earlier = timeOfDay(at) < timeOfDay(birth) ? 1 : 0;
    let totalMonths =
        (at.getUTCFullYear() - birth.getUTCFullYear()) * 12 +
        at.getUTCMonth() -
        birth.getUTCMonth();
    let days = at.getUTCDate() - birth.getUTCDate() - earlier;
    if (totalMonths > 0 && days < 0) {
        totalMonths -= 1;
        const monthIndex = birth.getUTCMonth() + totalMonths;
        const year = birth.getUTCFullYear() + Math.floor(monthIndex / 12);
        const month = monthIndex % 12;
        const anchor = Date.UTC(
            year,
            month,
            Math.min(birth.getUTCDate(), daysInMonth(year, month)),
        );
        const atDay = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
        days = Math.round((atDay - anchor) / DAY) - earlier;
    }
    return { years: Math.floor(totalMonths / 12), months: totalMonths % 12, days };
}

/**
 * The age at `at` of someone born at `birth`, in the Common User Interface's unit bands. Each is a full date (`YYYY-MM-DD`), a
 * timestamp with an offset, or a `Date`.
 *
 * - A partial date (a year, or a year and month) is a RangeError: it has no age. Ask `partialDatePrecision` first, and show
 *   `formatPartialDate` with the reader's words for an age that is not known.
 * - When either is a date with no time, the age is whole calendar days or longer, never hours or minutes, and a timestamp
 *   counts as the day it was written with. A `Date` counts as its UTC day, so pass the local date as text near midnight.
 */
export function ageParts(birth               , at               )            {
    const born = toMoment(birth);
    const asked = toMoment(at);
    const dateOnly = born.dateOnly || asked.dateOnly;
    const from = new Date(dateOnly ? born.day : born.time);
    const to = new Date(dateOnly ? asked.day : asked.time);
    const elapsed = to.getTime() - from.getTime();
    if (elapsed < 0) throw new RangeError("ageParts: `at` is before `birth`");
    if (!dateOnly && elapsed < 2 * HOUR)
        return [{ value: Math.floor(elapsed / MINUTE), unit: "minutes" }];
    if (!dateOnly && elapsed < 2 * DAY)
        return [{ value: Math.floor(elapsed / HOUR), unit: "hours" }];
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
    // Zero is written in the unit it was counted in: an age from a date alone is P0D, never a precise PT0M.
    if (!date && !time)
        return parts.length > 0 && parts.every((p) => p.unit !== "hours" && p.unit !== "minutes")
            ? "P0D"
            : "PT0M";
    return `P${date}${time ? `T${time}` : ""}`;
}

/** How much of a date a partial ISO 8601 date holds. */

const PARTIAL_DATE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

function parsePartialDate(iso        )                                                 {
    const match = PARTIAL_DATE.exec(iso);
    if (!match) throw new RangeError("not a partial ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD)");
    const year = Number(match[1]);
    const month = match[2] === undefined ? undefined : Number(match[2]);
    const day = match[3] === undefined ? undefined : Number(match[3]);
    if (month !== undefined && (month < 1 || month > 12))
        throw new RangeError("not a partial ISO 8601 date: the month is not 01 to 12");
    if (day !== undefined && (day < 1 || day > daysInMonth(year, (month          ) - 1)))
        throw new RangeError("not a calendar date: the day is outside its month");
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

/** A number divided by 100, as decimal text, so no digit changes. */
function hundredth(value        )         {
    const [mantissa, exponent = "0"] = String(value).split("e");
    return `${mantissa}e${Number(exponent) - 2}`;
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
    requireWritable(numerator);
    requireWritable(denominator);
    const number = (value        ) =>
        new Intl.NumberFormat(locale, {
            maximumFractionDigits: MAX_PLACES,
            useGrouping: true,
        }).format(value);
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
                maximumFractionDigits: MAX_PLACES,
                // As decimal text, exactly: dividing by 100 first turns 1.1 into 1.1000000000000001%. Intl reads a decimal string
                // (ES2023), which some packages' TypeScript lib settings predate.
            }).format(hundredth(numerator)                     );
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
            throw new RangeError("formatProportion: not a proportion kind");
    }
}

/** The parts of an ISO 8601 duration, in the shape Intl.DurationFormat takes, and whether it is negative. */

const ISO_DURATION =
    /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/;

/**
 * The parts of an ISO 8601 duration ("P1Y2M3DT4H", "-PT90M"). Pass them, without `negative`, to
 * `new Intl.DurationFormat(locale).format(parts)` for words in the reader's language. Nothing is converted: 90 minutes stays
 * 90 minutes, and a month is never turned into days.
 */
export function durationParts(iso        )                {
    const match = ISO_DURATION.exec(iso ?? "");
    if (!match || /^-?PT?$/.test(iso))
        throw new RangeError("durationParts: not an ISO 8601 duration");
    const n = (i        ) => (match[i] === undefined ? 0 : Number(match[i]));
    return {
        years: n(2),
        months: n(3),
        weeks: n(4),
        days: n(5),
        hours: n(6),
        minutes: n(7),
        // ISO 8601 and openEHR allow "," as the decimal sign as well as ".".
        seconds: match[8] === undefined ? 0 : Number(match[8].replace(",", ".")),
        negative: match[1] === "-",
    };
}

/**
 * An ISO 8601 duration as an HTML `<time datetime>` value, or null when it cannot be one. HTML takes only days, hours,
 * minutes and seconds, since a year or a month has no fixed length, and takes no sign, so the sign is returned apart.
 */
export function htmlDuration(iso        )                                                 {
    let parts               ;
    try {
        parts = durationParts(iso);
    } catch {
        return null;
    }
    if (parts.years || parts.months || parts.weeks || /[YW]|P\d+M/.test(iso.split("T")[0]))
        return null;
    // HTML takes only "." as the decimal sign.
    return { datetime: iso.replace(/^-/, "").replace(",", "."), negative: parts.negative };
}
