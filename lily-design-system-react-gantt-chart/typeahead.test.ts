import { describe, expect, it } from "vitest";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState } from "./typeahead";

describe("typeahead", () => {
    it("recognises printable single characters only", () => {
        expect(isTypeaheadKey({ key: "a" })).toBe(true);
        expect(isTypeaheadKey({ key: "É" })).toBe(true);
        expect(isTypeaheadKey({ key: " " })).toBe(false);
        expect(isTypeaheadKey({ key: "Enter" })).toBe(false);
        expect(isTypeaheadKey({ key: "a", ctrlKey: true })).toBe(false);
        expect(isTypeaheadKey({ key: "a", metaKey: true })).toBe(false);
    });
    it("grows the prefix within the reset time and starts over after it", () => {
        let s = nextTypeaheadState({ prefix: "", at: 0 }, "d", 1000);
        s = nextTypeaheadState(s, "e", 1300);
        expect(s.prefix).toBe("de");
        s = nextTypeaheadState(s, "x", 2200);
        expect(s.prefix).toBe("x");
    });
    const rows = ["Design", "Build", "Launch", "Deploy", "Docs"];
    it("finds the next row that starts with the prefix, after the current one", () => {
        expect(findTypeaheadMatch(rows, 0, "d")).toBe(3);
        expect(findTypeaheadMatch(rows, 3, "d")).toBe(4);
        expect(findTypeaheadMatch(rows, 4, "d")).toBe(0);
    });
    it("a longer prefix can stay on the current row", () => {
        expect(findTypeaheadMatch(rows, 3, "dep")).toBe(3);
        expect(findTypeaheadMatch(rows, 0, "de")).toBe(0);
    });
    it("ignores case and diacritics", () => {
        expect(findTypeaheadMatch(["Zoë", "Zed"], 1, "ZO")).toBe(0);
    });
    it("a repeated letter cycles through the rows that start with it", () => {
        expect(findTypeaheadMatch(rows, 0, "dd")).toBe(3);
        expect(findTypeaheadMatch(rows, 3, "dd")).toBe(4);
    });
    it("returns -1 for no match or no labels", () => {
        expect(findTypeaheadMatch(rows, 0, "zz9")).toBe(-1);
        expect(findTypeaheadMatch([], 0, "a")).toBe(-1);
        expect(findTypeaheadMatch(rows, 0, "")).toBe(-1);
    });
});
