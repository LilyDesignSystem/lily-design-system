import { describe, expect, it } from "vitest";
import {
    findTypeaheadMatch,
    isTypeaheadKey,
    nextTypeaheadState,
    TypeaheadError,
} from "./typeahead";

describe("typeahead", () => {
    it("recognises printable single characters only", () => {
        expect(isTypeaheadKey({ key: "a" })).toBe(true);
        expect(isTypeaheadKey({ key: "É" })).toBe(true);
        expect(isTypeaheadKey({ key: " " })).toBe(false);
        expect(isTypeaheadKey({ key: "Enter" })).toBe(false);
        expect(isTypeaheadKey({ key: "a", ctrlKey: true })).toBe(false);
        expect(isTypeaheadKey({ key: "a", metaKey: true })).toBe(false);
    });
    it("accepts a printable Unicode scalar in canonically equivalent forms", () => {
        for (const key of ["𠮷", "가", "가", "e\u0301"])
            expect(isTypeaheadKey({ key })).toBe(true);
        for (const key of ["", "\n", "\u200E", "\uD842", "ab"])
            expect(isTypeaheadKey({ key })).toBe(false);
        expect(isTypeaheadKey({ key: "𠮷", altKey: true })).toBe(false);
    });
    it("leaves composing initials to the input method", () => {
        expect(isTypeaheadKey({ key: "가", isComposing: true })).toBe(false);
        expect(isTypeaheadKey({ key: "가", nativeEvent: { isComposing: true } })).toBe(false);
        expect(isTypeaheadKey({ key: "가", nativeEvent: { isComposing: false } })).toBe(true);
    });
    it("grows the prefix within the reset time and starts over after it", () => {
        let s = nextTypeaheadState({ prefix: "", at: 0 }, "d", 1000);
        s = nextTypeaheadState(s, "e", 1700);
        expect(s.prefix).toBe("de");
        s = nextTypeaheadState(s, "x", 2401);
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
        expect(findTypeaheadMatch([], -1, "a")).toBe(-1);
        expect(findTypeaheadMatch(rows, 0, "")).toBe(-1);
        expect(findTypeaheadMatch(["undefined"], 0, "\u0301")).toBe(-1);
    });
    it("throws a TypeaheadError for a from that is not -1 or a row, never wraps it", () => {
        for (const from of [rows.length, -2, 0.5, NaN]) {
            expect(() => findTypeaheadMatch(rows, from, "a")).toThrow(TypeaheadError);
        }
        expect(() => findTypeaheadMatch([], 0, "a")).toThrow(RangeError);
    });
    it("keeps cycling when a combining mark folds away", () => {
        expect(findTypeaheadMatch(["x1", "x2"], 0, "x\u0338")).toBe(1);
    });
    it.each(["𠮷", "가", "𐐀", "e\u0301"])("cycles and extends the initial %s", (key) => {
        const labels = [key + "1", key + "2"];
        expect(findTypeaheadMatch(labels, 0, key)).toBe(1);
        expect(findTypeaheadMatch(labels, 1, key.repeat(2))).toBe(0);
        expect(findTypeaheadMatch(labels, 1, key + "2")).toBe(1);
    });
});
