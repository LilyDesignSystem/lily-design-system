import { describe, expect, test } from "vitest";
import {
    ageParts,
    durationParts,
    formatPartialDate,
    formatProportion,
    formatQuantity,
    formatRange,
    htmlDuration,
    MeterScaleError,
    meterScale,
    partialDatePrecision,
    toIsoDuration,
} from "./clinical-format";

const NBSP = " ";

describe("formatQuantity", () => {
    test("writes no trailing zero", () => {
        expect(formatQuantity(5.0, "mg", "en-GB")).toBe(`5${NBSP}mg`);
        expect(formatQuantity(2.5, "mg", "en-GB")).toBe(`2.5${NBSP}mg`);
    });

    test("always writes a leading zero", () => {
        expect(formatQuantity(0.5, "mg", "en-GB")).toBe(`0.5${NBSP}mg`);
        expect(formatQuantity(0.125, "mg", "en-US")).toBe(`0.125${NBSP}mg`);
    });

    test("groups thousands, so 5000 is not read as 500", () => {
        expect(formatQuantity(5000, "units", "en-GB")).toBe(`5,000${NBSP}units`);
    });

    test("follows the locale's decimal and grouping marks", () => {
        expect(formatQuantity(0.5, "mg", "de-DE")).toBe(`0,5${NBSP}mg`);
        expect(formatQuantity(1250.5, "mL", "de-DE")).toBe(`1.250,5${NBSP}mL`);
    });

    test("joins number and unit with a no-break space", () => {
        expect(formatQuantity(10, "mL", "en-GB")).toContain(NBSP);
        expect(formatQuantity(10, "mL", "en-GB")).not.toContain(" ");
    });

    test("keeps every digit the caller gave", () => {
        expect(formatQuantity(0.0625, "mg", "en-GB")).toBe(`0.0625${NBSP}mg`);
    });

    test("writes the number alone without a unit", () => {
        expect(formatQuantity(7, "", "en-GB")).toBe("7");
    });

    test("writes a FHIR comparator before the number, never dropping it", () => {
        expect(formatQuantity(5, "mmol/L", "en-GB", "<")).toBe(`<5${NBSP}mmol/L`);
        expect(formatQuantity(5, "mmol/L", "en-GB", "<=")).toBe(`≤5${NBSP}mmol/L`);
        expect(formatQuantity(0.5, "mg", "de-DE", ">=")).toBe(`≥0,5${NBSP}mg`);
        expect(formatQuantity(90, "", "en-GB", ">")).toBe(">90");
        expect(formatQuantity(5, "mmol/L", "en-GB")).toBe(`5${NBSP}mmol/L`);
    });

    test("writes openEHR's approximate comparator as ≈, never dropping it", () => {
        expect(formatQuantity(3, "kg", "en-GB", "~")).toBe(`≈3${NBSP}kg`);
        expect(formatQuantity(2.5, "L", "de-DE", "~")).toBe(`≈2,5${NBSP}L`);
    });

    test("refuses a comparator neither FHIR nor openEHR defines", () => {
        expect(() => formatQuantity(5, "mg", "en-GB", "=~" as never)).toThrow(RangeError);
        expect(() => formatQuantity(5, "mg", "en-GB", "toString" as never)).toThrow(RangeError);
    });

    test("refuses a missing locale or a non-finite value", () => {
        expect(() => formatQuantity(5, "mg", "")).toThrow(RangeError);
        expect(() => formatQuantity(Number.NaN, "mg", "en-GB")).toThrow(RangeError);
        expect(() => formatQuantity(Number.POSITIVE_INFINITY, "mg", "en-GB")).toThrow(RangeError);
    });
});

describe("formatRange", () => {
    test("writes low to high with the unit after the high end", () => {
        expect(formatRange(3.5, 5.5, "mmol/L", "en-GB")).toBe(`3.5–5.5${NBSP}mmol/L`);
    });
    test("follows the locale's marks, and groups thousands", () => {
        expect(formatRange(3.5, 5.5, "mmol/L", "de-DE")).toBe(`3,5–5,5${NBSP}mmol/L`);
        expect(formatRange(1000, 2500, "units", "en")).toBe(`1,000–2,500${NBSP}units`);
    });
    test("writes equal ends as one number, never as approximate", () => {
        expect(formatRange(5, 5, "mg", "en-GB")).toBe(`5${NBSP}mg`);
    });
    test("keeps the dash's spacing when an end is negative", () => {
        expect(formatRange(-2, 3, "°C", "en-GB")).toBe(`-2 – 3${NBSP}°C`);
    });
    test("writes the range alone without a unit", () => {
        expect(formatRange(1, 2, "", "en-GB")).toBe("1–2");
    });
    test("refuses a range given backwards, so it can never read high to low", () => {
        expect(() => formatRange(2.12, 1.82, "", "en-GB")).toThrow(
            "formatRange: low 2.12 is above high 1.82",
        );
    });
    test("keeps every digit the caller gave", () => {
        expect(formatRange(0.12345, 0.98765, "", "en-GB")).toBe("0.12345–0.98765");
    });
    test("refuses a missing locale or a non-finite end, saying which", () => {
        expect(() => formatRange(1, 2, "mg", "")).toThrow(/formatRange: a locale is required/);
        expect(() => formatRange(Number.NaN, 2, "mg", "en")).toThrow(
            /formatRange: low and high must be finite/,
        );
        expect(() => formatRange(1, Number.POSITIVE_INFINITY, "mg", "en")).toThrow(
            /must be finite/,
        );
    });
});

describe("ageParts", () => {
    const birth = "2026-01-10T08:00:00Z";
    const after = (ms: number) => new Date(Date.parse(birth) + ms).toISOString();
    const MIN = 60_000;
    const HOUR = 60 * MIN;
    const DAY = 24 * HOUR;

    test("minutes under 2 hours", () => {
        expect(ageParts(birth, after(0))).toEqual([{ value: 0, unit: "minutes" }]);
        expect(ageParts(birth, after(2 * HOUR - MIN))).toEqual([{ value: 119, unit: "minutes" }]);
    });

    test("hours from 2 hours to under 2 days", () => {
        expect(ageParts(birth, after(2 * HOUR))).toEqual([{ value: 2, unit: "hours" }]);
        expect(ageParts(birth, after(2 * DAY - MIN))).toEqual([{ value: 47, unit: "hours" }]);
    });

    test("days from 2 days to under 4 weeks", () => {
        expect(ageParts(birth, after(2 * DAY))).toEqual([{ value: 2, unit: "days" }]);
        expect(ageParts(birth, after(27 * DAY))).toEqual([{ value: 27, unit: "days" }]);
    });

    test("weeks and days from 4 weeks to under 1 year", () => {
        expect(ageParts(birth, after(28 * DAY))).toEqual([
            { value: 4, unit: "weeks" },
            { value: 0, unit: "days" },
        ]);
        expect(ageParts(birth, after(100 * DAY))).toEqual([
            { value: 14, unit: "weeks" },
            { value: 2, unit: "days" },
        ]);
        expect(ageParts("2025-01-10", "2026-01-09")[0].unit).toBe("weeks");
    });

    test("months and days from 1 year to under 2 years", () => {
        expect(ageParts("2025-01-10", "2026-01-10")).toEqual([
            { value: 12, unit: "months" },
            { value: 0, unit: "days" },
        ]);
        expect(ageParts("2024-03-15", "2026-03-14")).toEqual([
            { value: 23, unit: "months" },
            { value: 27, unit: "days" },
        ]);
    });

    test("years and months from 2 years to under 18", () => {
        expect(ageParts("2024-03-15", "2026-03-15")).toEqual([
            { value: 2, unit: "years" },
            { value: 0, unit: "months" },
        ]);
        expect(ageParts("2008-11-20", "2026-11-19")).toEqual([
            { value: 17, unit: "years" },
            { value: 11, unit: "months" },
        ]);
    });

    test("years alone from 18", () => {
        expect(ageParts("2008-11-20", "2026-11-20")).toEqual([{ value: 18, unit: "years" }]);
        expect(ageParts("1950-06-01", "2026-11-14")).toEqual([{ value: 76, unit: "years" }]);
    });

    test("a 29 February birthday", () => {
        expect(ageParts("2008-02-29", "2026-02-28")).toEqual([
            { value: 17, unit: "years" },
            { value: 11, unit: "months" },
        ]);
        expect(ageParts("2008-02-29", "2026-03-01")).toEqual([{ value: 18, unit: "years" }]);
    });

    test("refuses a date in the wrong order or not a date", () => {
        expect(() => ageParts("2026-01-02", "2026-01-01")).toThrow(RangeError);
        expect(() => ageParts("not a date", "2026-01-01")).toThrow(RangeError);
    });
});

describe("toIsoDuration", () => {
    test("writes each band", () => {
        expect(toIsoDuration([{ value: 90, unit: "minutes" }])).toBe("PT90M");
        expect(toIsoDuration([{ value: 30, unit: "hours" }])).toBe("PT30H");
        expect(toIsoDuration([{ value: 12, unit: "days" }])).toBe("P12D");
        expect(
            toIsoDuration([
                { value: 3, unit: "weeks" },
                { value: 2, unit: "days" },
            ]),
        ).toBe("P23D");
        expect(
            toIsoDuration([
                { value: 14, unit: "months" },
                { value: 3, unit: "days" },
            ]),
        ).toBe("P14M3D");
        expect(
            toIsoDuration([
                { value: 5, unit: "years" },
                { value: 2, unit: "months" },
            ]),
        ).toBe("P5Y2M");
        expect(toIsoDuration([{ value: 76, unit: "years" }])).toBe("P76Y");
    });

    test("writes zero as PT0M", () => {
        expect(toIsoDuration([{ value: 0, unit: "minutes" }])).toBe("PT0M");
    });
});

describe("formatPartialDate", () => {
    test("writes a year alone, never inventing a month or day", () => {
        expect(formatPartialDate("2019", "en-GB")).toBe("2019");
        expect(formatPartialDate("2019", "de-DE")).toBe("2019");
    });

    test("writes a month and year with the month as a word, never inventing a day", () => {
        expect(formatPartialDate("2019-03", "en-GB")).toBe("March 2019");
        expect(formatPartialDate("2019-03", "de-DE")).toBe("März 2019");
        expect(formatPartialDate("2019-03", "en-GB", { month: "short" })).toBe("Mar 2019");
        expect(formatPartialDate("2019-03", "en-GB")).not.toMatch(/\b1\b/);
    });

    test("writes a full date with the month as a word", () => {
        expect(formatPartialDate("2019-03-14", "en-GB")).toBe("14 March 2019");
        expect(formatPartialDate("2019-03-14", "en-US")).toBe("March 14, 2019");
        expect(formatPartialDate("2019-03-14", "de-DE")).toBe("14. März 2019");
    });

    test("does not move a date across a day boundary in any time zone", () => {
        expect(formatPartialDate("2019-01-01", "en-GB")).toBe("1 January 2019");
        expect(formatPartialDate("2019-12-31", "en-GB")).toBe("31 December 2019");
    });

    test("refuses what is not a partial date", () => {
        for (const bad of [
            "19",
            "2019-3",
            "2019-13",
            "2019-02-30",
            "2019-03-14T10:00",
            "",
            "March 2019",
        ])
            expect(() => formatPartialDate(bad, "en-GB")).toThrow(RangeError);
        expect(() => formatPartialDate("2019", "")).toThrow(RangeError);
    });
});

describe("partialDatePrecision", () => {
    test("names how much of the date there is", () => {
        expect(partialDatePrecision("2019")).toBe("year");
        expect(partialDatePrecision("2019-03")).toBe("month");
        expect(partialDatePrecision("2019-03-14")).toBe("day");
    });
});

describe("formatProportion", () => {
    test("refuses a numerator or denominator that is not finite", () => {
        expect(() => formatProportion(Number.NaN, 2, "ratio", "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(1, Number.POSITIVE_INFINITY, "ratio", "en-GB")).toThrow(
            RangeError,
        );
    });

    test("refuses a missing locale", () => {
        expect(() => formatProportion(1, 2, "ratio", "")).toThrow(RangeError);
    });
    test("writes each openEHR kind", () => {
        expect(formatProportion(1, 128, "ratio", "en-GB")).toBe("1:128");
        expect(formatProportion(0.5, 1, "unitary", "en-GB")).toBe("0.5");
        expect(formatProportion(45, 100, "percent", "en-GB")).toBe("45%");
        expect(formatProportion(1, 2, "fraction", "en-GB")).toBe("1/2");
        expect(formatProportion(3, 2, "integer-fraction", "en-GB")).toBe(`1${NBSP}1/2`);
    });

    test("follows the locale's numbers", () => {
        expect(formatProportion(45, 100, "percent", "fr-FR")).toBe(`45${NBSP}%`);
        expect(formatProportion(1, 1024, "ratio", "en-GB")).toBe("1:1,024");
        expect(formatProportion(0.5, 1, "unitary", "de-DE")).toBe("0,5");
    });

    test("reduces nothing and writes whole or proper integer fractions plainly", () => {
        expect(formatProportion(2, 4, "fraction", "en-GB")).toBe("2/4");
        expect(formatProportion(4, 2, "integer-fraction", "en-GB")).toBe("2");
        expect(formatProportion(1, 2, "integer-fraction", "en-GB")).toBe("1/2");
        expect(formatProportion(-3, 2, "integer-fraction", "en-GB")).toBe(`-1${NBSP}1/2`);
    });

    test("refuses a denominator the kind does not allow", () => {
        expect(() => formatProportion(1, 0, "ratio", "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(1, 2, "unitary", "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(45, 10, "percent", "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(1.5, 2, "fraction", "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(1, 0, "integer-fraction", "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(1, 2, "odds" as never, "en-GB")).toThrow(RangeError);
        expect(() => formatProportion(1, 2, "ratio", "")).toThrow(RangeError);
    });
});

describe("durationParts", () => {
    test("returns each part, converting nothing", () => {
        expect(durationParts("P1Y2M3W4DT5H6M7S")).toEqual({
            years: 1,
            months: 2,
            weeks: 3,
            days: 4,
            hours: 5,
            minutes: 6,
            seconds: 7,
            negative: false,
        });
        expect(durationParts("PT90M").minutes).toBe(90);
        expect(durationParts("PT1.5S").seconds).toBe(1.5);
    });

    test("keeps the sign apart", () => {
        expect(durationParts("-P3D")).toMatchObject({ days: 3, negative: true });
    });

    test("refuses what is not a duration", () => {
        for (const bad of ["", "P", "PT", "3D", "P3", "PT3D", "P1.5D", "P3D4H"])
            expect(() => durationParts(bad)).toThrow(RangeError);
    });
});

describe("htmlDuration", () => {
    test("takes days, hours, minutes and seconds as a datetime", () => {
        expect(htmlDuration("P3DT4H")).toEqual({ datetime: "P3DT4H", negative: false });
        expect(htmlDuration("PT90M")).toEqual({ datetime: "PT90M", negative: false });
    });

    test("returns the sign apart, since a datetime has none", () => {
        expect(htmlDuration("-P3D")).toEqual({ datetime: "P3D", negative: true });
    });

    test("refuses years, months and weeks, which HTML does not take", () => {
        expect(htmlDuration("P1Y")).toBeNull();
        expect(htmlDuration("P2M")).toBeNull();
        expect(htmlDuration("P1W")).toBeNull();
        expect(htmlDuration("PT2M")).not.toBeNull();
        expect(htmlDuration("nonsense")).toBeNull();
    });
});

describe("meterScale", () => {
    test("a two-sided range: half a range beyond each end", () => {
        expect(meterScale(5.2, 3.5, 5.5)).toEqual({ min: 2.5, max: 6.5, low: 3.5, high: 5.5 });
    });

    test("a one-sided range: from zero to half as far again", () => {
        expect(meterScale(3, undefined, 5)).toEqual({ min: 0, max: 7.5, high: 5 });
        expect(meterScale(70, 60)).toEqual({ min: 0, max: 90, low: 60 });
    });

    test("null is the same as absent", () => {
        expect(meterScale(3, null, 5)).toEqual({ min: 0, max: 7.5, high: 5 });
        expect(meterScale(70, 60, null)).toEqual({ min: 0, max: 90, low: 60 });
    });

    test("always wide enough to hold the value", () => {
        expect(meterScale(9, 3.5, 5.5)).toEqual({ min: 2.5, max: 9, low: 3.5, high: 5.5 });
        expect(meterScale(-1, 3.5, 5.5)).toEqual({ min: -1, max: 6.5, low: 3.5, high: 5.5 });
        expect(meterScale(20, undefined, 5)).toEqual({ min: 0, max: 20, high: 5 });
        expect(meterScale(-2, undefined, 5)).toEqual({ min: -2, max: 7.5, high: 5 });
    });

    test("a value on an end of the range, or in the middle, changes nothing", () => {
        expect(meterScale(3.5, 3.5, 5.5)).toEqual({ min: 2.5, max: 6.5, low: 3.5, high: 5.5 });
        expect(meterScale(4.5, 3.5, 5.5)).toEqual({ min: 2.5, max: 6.5, low: 3.5, high: 5.5 });
    });

    test("a negative two-sided range is scaled the same way", () => {
        expect(meterScale(-3, -4, -2)).toEqual({ min: -5, max: -1, low: -4, high: -2 });
    });

    const reason = (fn: () => unknown) => {
        try {
            fn();
        } catch (error) {
            expect(error).toBeInstanceOf(MeterScaleError);
            expect(error).toBeInstanceOf(RangeError);
            return (error as MeterScaleError).reason;
        }
        throw new Error("did not throw");
    };

    test("no meter, and no error, when there is nothing to draw: no value or no range", () => {
        expect(meterScale(undefined, 3.5, 5.5)).toBeUndefined();
        expect(meterScale(null, 3.5, 5.5)).toBeUndefined();
        expect(meterScale(5)).toBeUndefined();
        expect(meterScale(5, undefined, undefined)).toBeUndefined();
        expect(meterScale(5, null, null)).toBeUndefined();
    });

    test("a value that is not a finite number is an error", () => {
        for (const value of [NaN, Infinity, -Infinity, "5" as unknown as number]) {
            expect(reason(() => meterScale(value, 3.5, 5.5))).toBe("value");
        }
    });

    test("an end of the range that is given but not a finite number is an error", () => {
        expect(reason(() => meterScale(5, NaN, 5.5))).toBe("range");
        expect(reason(() => meterScale(5, 3.5, Infinity))).toBe("range");
        expect(reason(() => meterScale(5, "3.5" as unknown as number, 5.5))).toBe("range");
        expect(reason(() => meterScale(5, undefined, NaN))).toBe("range");
    });

    test("a two-sided range that is reversed or has no width is an error", () => {
        expect(reason(() => meterScale(5, 5.5, 3.5))).toBe("reversed");
        expect(reason(() => meterScale(5, 4, 4))).toBe("reversed");
    });

    test("a one-sided bound that is not above zero is an error", () => {
        expect(reason(() => meterScale(1, undefined, 0))).toBe("bound");
        expect(reason(() => meterScale(1, undefined, -3))).toBe("bound");
        expect(reason(() => meterScale(1, 0))).toBe("bound");
        expect(reason(() => meterScale(1, -3))).toBe("bound");
    });

    test("the message names the bad input", () => {
        expect(() => meterScale(5, 5.5, 3.5)).toThrow(/reversed.*5\.5 to 3\.5/);
        expect(() => meterScale(NaN, 1, 2)).toThrow(
            /^meterScale: the value is not a finite number/,
        );
        expect(new MeterScaleError("units", "x").name).toBe("MeterScaleError");
    });

    test("two different units for the value and the range are an error", () => {
        expect(() => meterScale(5, 3.5, 5.5, { value: "mmol/L", range: "mg/dL" })).toThrow(
            MeterScaleError,
        );
    });

    test("the same unit, or a unit left out on either side, is not a difference", () => {
        const scale = { min: 2.5, max: 6.5, low: 3.5, high: 5.5 };
        expect(meterScale(5, 3.5, 5.5, { value: "mmol/L", range: "mmol/L" })).toEqual(scale);
        expect(meterScale(5, 3.5, 5.5, { value: "mmol/L" })).toEqual(scale);
        expect(meterScale(5, 3.5, 5.5, { range: "mmol/L" })).toEqual(scale);
        expect(meterScale(5, 3.5, 5.5, { value: null, range: "mg/dL" })).toEqual(scale);
        expect(meterScale(5, 3.5, 5.5, {})).toEqual(scale);
    });

    test("does not write a low or high the range did not have", () => {
        expect(Object.keys(meterScale(3, undefined, 5)!)).toEqual(["min", "max", "high"]);
        expect(Object.keys(meterScale(70, 60)!)).toEqual(["min", "max", "low"]);
    });
});

describe("clinical-format edge cases (coverage)", () => {
    test("ageParts refuses a date that is not a date", () => {
        expect(() => ageParts("not a date", "2026-01-01")).toThrow(RangeError);
        expect(() => ageParts("2020-01-01", new Date(NaN))).toThrow(/not a date/);
    });

    test("an age whose time of day is earlier than the birth time borrows a day, then a month", () => {
        // Born 12:00 on the 15th, asked at 08:00 on the 15th: not yet a whole month, so the months step back and the days borrow.
        expect(ageParts("2020-01-15T12:00:00Z", "2026-03-15T08:00:00Z")).toEqual([
            { value: 6, unit: "years" },
            { value: 1, unit: "months" },
        ]);
        // The same across a year boundary (previous month is December).
        expect(ageParts("2020-12-15T12:00:00Z", "2027-01-15T08:00:00Z")).toEqual([
            { value: 6, unit: "years" },
            { value: 0, unit: "months" },
        ]);
    });

    test("durationParts refuses an empty duration, a missing one, and a bare designator", () => {
        for (const bad of ["", "P", "PT", "-P", "-PT", "5 days"]) {
            expect(() => durationParts(bad)).toThrow(RangeError);
        }
        expect(() => durationParts(undefined as unknown as string)).toThrow(RangeError);
    });
});
