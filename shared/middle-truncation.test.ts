import { describe, expect, test } from "vitest";
import { splitGraphemes, truncateMiddle } from "./middle-truncation";

// One unit per grapheme: widths are cluster counts, so expectations are exact.
const measure = (s: string) => splitGraphemes(s).length;
const base = { ellipsis: "…", measure };

describe("truncateMiddle", () => {
    test("returns the text unchanged when it fits", () => {
        expect(truncateMiddle("report.pdf", { ...base, maxWidth: 10 })).toBe("report.pdf");
        expect(truncateMiddle("", { ...base, maxWidth: 0 })).toBe("");
    });

    test("even: splits the room, the end taking the odd cluster", () => {
        // room = 8 − 1 (ellipsis) = 7 clusters: 3 at the start, 4 at the end.
        expect(truncateMiddle("quarterly-report-final.pdf", { ...base, maxWidth: 8 })).toBe("qua….pdf");
        const out = truncateMiddle("abcdefghijklmnopqrstuvwxyz", { ...base, maxWidth: 8 });
        expect(out).toBe("abc…wxyz");
        expect(measure(out)).toBe(8);
    });

    test("fixed-end: keeps exactly `end` clusters at the end", () => {
        const out = truncateMiddle("quarterly-report-final.pdf", { ...base, maxWidth: 12, strategy: "fixed-end", end: 4 });
        expect(out).toBe("quarter…" + ".pdf");
        expect(measure(out)).toBe(12);
    });

    test("min-end: an even split, but never fewer than `end` at the end", () => {
        // Even would keep 4 at the end of an 8-wide result; min-end 6 keeps 6 and gives the start the rest.
        const out = truncateMiddle("abcdefghijklmnopqrstuvwxyz", { ...base, maxWidth: 8, strategy: "min-end", end: 6 });
        expect(out).toBe("a…uvwxyz");
        expect(out.endsWith("uvwxyz")).toBe(true);
        expect(measure(out)).toBe(8);
    });

    test("fixed-end with end 0 keeps nothing at the end (no slice(-0) whole-string bug)", () => {
        expect(truncateMiddle("abcdefghij", { ...base, maxWidth: 5, strategy: "fixed-end", end: 0 })).toBe("abcd…");
    });

    test("end larger than the text is clamped", () => {
        const out = truncateMiddle("abcdef", { ...base, maxWidth: 3, strategy: "fixed-end", end: 99 });
        expect(out.startsWith("…")).toBe(true);
    });

    test("never splits a surrogate pair or an emoji sequence", () => {
        const text = "👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦";
        const out = truncateMiddle(text, { ...base, maxWidth: 3 });
        expect(out).toBe("👩‍👩‍👧‍👦…👩‍👩‍👧‍👦");
        expect(splitGraphemes(out)).toHaveLength(3);
    });

    test("the ellipsis is whatever the caller passes, however wide", () => {
        const out = truncateMiddle("abcdefghijklmnop", { ...base, ellipsis: "[...]", maxWidth: 9 });
        expect(out).toBe("ab[...]op");
        expect(measure(out)).toBe(9);
    });

    test("a width smaller than the ellipsis still returns the ellipsis", () => {
        expect(truncateMiddle("abcdefghij", { ...base, maxWidth: 0 })).toBe("…");
    });

    test("uses proportional widths from the measure function", () => {
        const wide = (s: string) => [...s].reduce((w, c) => w + (c === "W" ? 3 : 1), 0);
        const out = truncateMiddle("WWWWWWWWWWWWWW", { ellipsis: "…", maxWidth: 10, measure: wide });
        expect(wide(out)).toBeLessThanOrEqual(10);
        expect(out).toContain("…");
    });
});
