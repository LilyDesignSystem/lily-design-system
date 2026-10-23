import { describe, expect, test } from "vitest";
import { columnCount, daysInYear, yearOfDaysCells } from "./year-of-days-layout";

describe("year-of-days-layout", () => {
    test("counts 365 days, and 366 in leap years", () => {
        expect(daysInYear(2026)).toBe(365);
        expect(daysInYear(2024)).toBe(366);
        expect(daysInYear(1900)).toBe(365);
        expect(daysInYear(2000)).toBe(366);
    });

    test("1 January 2026 is a Thursday: row 4 from Sunday, row 3 from Monday", () => {
        expect(yearOfDaysCells(2026, 0)[0]).toEqual({ date: "2026-01-01", dayOfYear: 0, column: 0, row: 4 });
        expect(yearOfDaysCells(2026, 1)[0]).toEqual({ date: "2026-01-01", dayOfYear: 0, column: 0, row: 3 });
    });

    test("the week turns over on weekStart: 4 January 2026 (Sunday) opens column 1 from Sunday", () => {
        const cells = yearOfDaysCells(2026, 0);
        expect(cells[3]).toMatchObject({ date: "2026-01-04", column: 1, row: 0 });
        expect(cells[2]).toMatchObject({ date: "2026-01-03", column: 0, row: 6 });
    });

    test("every cell has a distinct position and rows stay within 0 to 6", () => {
        for (const weekStart of [0, 1, 6]) {
            const cells = yearOfDaysCells(2024, weekStart);
            expect(cells).toHaveLength(366);
            expect(new Set(cells.map((c) => `${c.column}:${c.row}`)).size).toBe(366);
            expect(cells.every((c) => c.row >= 0 && c.row <= 6)).toBe(true);
        }
    });

    test("columns run 0 to columnCount − 1 and the last day is in the last column", () => {
        for (const year of [2023, 2024, 2026]) {
            for (const weekStart of [0, 1, 6]) {
                const cells = yearOfDaysCells(year, weekStart);
                expect(cells[cells.length - 1].column).toBe(columnCount(year, weekStart) - 1);
                expect([53, 54]).toContain(columnCount(year, weekStart));
            }
        }
    });

    test("a leap year starting on the last row needs 54 columns", () => {
        // 1 January 2000 is a Saturday: from Sunday it is row 6, and 366 days then span 54 columns.
        expect(columnCount(2000, 0)).toBe(54);
    });

    test("dates are calendar dates, not shifted by the local time zone", () => {
        const cells = yearOfDaysCells(2026, 1);
        expect(cells[0].date).toBe("2026-01-01");
        expect(cells[cells.length - 1].date).toBe("2026-12-31");
    });

    test("rejects a bad year or weekStart", () => {
        expect(() => yearOfDaysCells(2026.5, 0)).toThrow(RangeError);
        expect(() => yearOfDaysCells(2026, 7)).toThrow(RangeError);
        expect(() => columnCount(0, 0)).toThrow(RangeError);
    });
});
