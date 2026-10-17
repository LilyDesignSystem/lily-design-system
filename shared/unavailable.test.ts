import { describe, expect, it } from "vitest";
import { epochDayOf, unavailableIn, unavailableKinds, unavailableOn, type Unavailable } from "./unavailable";

const ITEMS: Unavailable[] = [
    { start: "2026-12-25", kind: "holiday", label: "Christmas" },
    { start: "2026-12-28", end: "2026-12-31", kind: "leave", label: "Ann off" },
    { start: "2026-12-30", end: "2026-12-29" }, // reversed: still the two days
];

describe("unavailable", () => {
    it("reads ISO dates and rejects the rest", () => {
        expect(epochDayOf("1970-01-02")).toBe(1);
        expect(epochDayOf("2026-02-31")).toBeNaN();
        expect(epochDayOf("26-1-1")).toBeNaN();
    });
    it("finds the entries covering a day", () => {
        expect(unavailableOn(ITEMS, "2026-12-25").map((i) => i.label)).toEqual(["Christmas"]);
        expect(unavailableOn(ITEMS, "2026-12-30").map((i) => i.label)).toEqual(["Ann off", undefined]);
        expect(unavailableOn(ITEMS, "2026-12-26")).toEqual([]);
        expect(unavailableOn(undefined, "2026-12-25")).toEqual([]);
        expect(unavailableOn(ITEMS, "nope")).toEqual([]);
    });
    it("a column is fully covered only when every day is", () => {
        expect(unavailableIn(ITEMS, "2026-12-25", "2026-12-25")).toMatchObject({ all: true });
        const week = unavailableIn(ITEMS, "2026-12-21", "2026-12-27");
        expect(week.all).toBe(false);
        expect(week.items.map((i) => i.label)).toEqual(["Christmas"]);
        expect(unavailableIn(ITEMS, "2026-12-28", "2026-12-31").all).toBe(true);
    });
    it("coverage can come from several entries together", () => {
        const two: Unavailable[] = [{ start: "2026-01-01", end: "2026-01-02" }, { start: "2026-01-03", end: "2026-01-04" }];
        expect(unavailableIn(two, "2026-01-01", "2026-01-04").all).toBe(true);
    });
    it("a column nothing touches holds nothing", () => {
        expect(unavailableIn(ITEMS, "2026-11-01", "2026-11-30")).toEqual({ items: [], all: false });
        expect(unavailableIn([], "2026-11-01", "2026-11-30")).toEqual({ items: [], all: false });
    });
    it("kinds become one token list, defaulting to unavailable, without repeats", () => {
        expect(unavailableKinds([])).toBeUndefined();
        expect(unavailableKinds([{ start: "2026-01-01" }])).toBe("unavailable");
        expect(unavailableKinds([{ start: "a", kind: "leave" }, { start: "b", kind: "leave" }, { start: "c", kind: "holiday" }])).toBe("leave holiday");
    });
    it("ignores entries with a bad date", () => {
        expect(unavailableOn([{ start: "bad" }], "2026-01-01")).toEqual([]);
    });
});
