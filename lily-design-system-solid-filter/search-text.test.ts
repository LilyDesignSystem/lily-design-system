import { describe, expect, it } from "vitest";
import { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text";

describe("search text", () => {
    it("folds case and diacritics", () => {
        expect(foldText("Café ÉCOLE")).toBe("cafe ecole");
    });
    it("splits a query into terms", () => {
        expect(searchTerms("  Foo   bar ")).toEqual(["foo", "bar"]);
        expect(searchTerms("   ")).toEqual([]);
    });
    it("an empty query matches everything", () => {
        expect(matchesSearch("anything", "")).toBe(true);
        expect(matchesSearch("", "   ")).toBe(true);
    });
    it("every term must appear, in any order", () => {
        expect(matchesSearch("Design the login page", "page login")).toBe(true);
        expect(matchesSearch("Design the login page", "login logout")).toBe(false);
    });
    it("ignores case and diacritics both ways", () => {
        expect(matchesSearch("Café Roma", "CAFE")).toBe(true);
        expect(matchesSearch("Cafe Roma", "café")).toBe(true);
    });
    it("highlights every occurrence of every term", () => {
        expect(highlightSegments("Design the design", "des")).toEqual([
            { text: "Des", match: true },
            { text: "ign the ", match: false },
            { text: "des", match: true },
            { text: "ign", match: false },
        ]);
    });
    it("highlights across terms and merges overlaps", () => {
        expect(highlightSegments("abcdef", "abc cde")).toEqual([
            { text: "abcde", match: true },
            { text: "f", match: false },
        ]);
    });
    it("highlights a diacritic match in the original text", () => {
        expect(highlightSegments("Café", "cafe")).toEqual([{ text: "Café", match: true }]);
    });
    it("returns one unmarked run for a blank query or text", () => {
        expect(highlightSegments("abc", "")).toEqual([{ text: "abc", match: false }]);
        expect(highlightSegments("", "abc")).toEqual([{ text: "", match: false }]);
    });
});
