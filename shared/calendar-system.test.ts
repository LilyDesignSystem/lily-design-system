import { describe, expect, test } from "vitest";

import {
    calendarAddMonths,
    calendarDay,
    calendarLocale,
    calendarMonthLength,
    calendarMonthMatrix,
    calendarMonthStart,
} from "./calendar-system";

// Fixed points: Nowruz 1404 was 2025-03-21; 1 Ramadan 1447 is 2026-02-18 in the Umm al-Qura calendar;
// Buddhist months are the Gregorian months with another year number.
describe("calendar-system", () => {
    test("Persian: 1 Farvardin 1404", () => {
        expect(calendarDay("2025-03-21", "persian")).toBe(1);
        expect(calendarMonthStart("2025-04-02", "persian")).toBe("2025-03-21");
        expect(calendarMonthLength("2025-03-21", "persian")).toBe(31);
    });

    test("Persian: the last month of a common year has 29 days, of a leap year 30", () => {
        expect(calendarMonthLength(calendarMonthStart("2025-03-20", "persian"), "persian")).toBe(
            30,
        ); // 1403 is leap
        expect(calendarMonthLength(calendarMonthStart("2026-03-20", "persian"), "persian")).toBe(
            29,
        ); // 1404 is not
    });

    test("Islamic Umm al-Qura: 1 Ramadan 1447", () => {
        expect(calendarDay("2026-02-18", "islamic-umalqura")).toBe(1);
        expect([29, 30]).toContain(calendarMonthLength("2026-02-18", "islamic-umalqura"));
    });

    test("Buddhist months match Gregorian months", () => {
        expect(calendarMonthStart("2026-02-14", "buddhist")).toBe("2026-02-01");
        expect(calendarMonthLength("2026-02-01", "buddhist")).toBe(28);
        expect(calendarMonthLength("2024-02-01", "buddhist")).toBe(29);
    });

    test("Gregorian is the default", () => {
        expect(calendarMonthStart("2026-11-03")).toBe("2026-11-01");
        expect(calendarMonthLength("2026-11-01")).toBe(30);
        expect(calendarAddMonths("2026-11-01", 2)).toBe("2027-01-01");
    });

    test("paging forward and back returns to the same month, across a year end", () => {
        for (const calendar of [
            "persian",
            "islamic-umalqura",
            "hebrew",
            "buddhist",
            "chinese",
            "ethiopic",
        ]) {
            const start = calendarMonthStart("2026-03-01", calendar);
            expect(calendarAddMonths(calendarAddMonths(start, 14, calendar), -14, calendar)).toBe(
                start,
            );
        }
    });

    test("the grid has six rows of seven, starts on the first weekday and holds the whole month", () => {
        const rows = calendarMonthMatrix("2025-03-21", 6, "persian");
        expect(rows.length).toBe(6);
        expect(rows.every((row) => row.length === 7)).toBe(true);
        expect(new Date(`${rows[0][0]}T00:00:00Z`).getUTCDay()).toBe(6);
        expect(rows.flat()).toContain("2025-03-21");
        expect(rows.flat()).toContain("2025-04-20");
    });

    test("calendarLocale sets the calendar and leaves a missing locale alone", () => {
        expect(calendarLocale("fa-IR", "persian")).toBe("fa-IR-u-ca-persian");
        expect(calendarLocale(undefined, "persian")).toBeUndefined();
    });
});
