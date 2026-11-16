import { describe, expect, test } from "vitest";
import {
    ageParts,
    formatPartialDate,
    formatProportion,
    formatQuantity,
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
