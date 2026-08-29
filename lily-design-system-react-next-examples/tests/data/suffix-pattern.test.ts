import { describe, expect, test } from "vitest";
import { components } from "../../app/data/components";
import { suffixPatternOf, SUFFIX_LABEL, SUFFIX_PATTERNS, STANDALONE_ID } from "../../app/data/suffix-pattern";

describe("suffixPatternOf", () => {
    test("matches the most specific (longest) suffix first", () => {
        expect(suffixPatternOf("data-table-th")).toBe("table-th");
        expect(suffixPatternOf("data-table-head")).toBe("table-head");
        expect(suffixPatternOf("breadcrumb-list-item")).toBe("list-item");
        expect(suffixPatternOf("breadcrumb-list")).toBe("list");
        expect(suffixPatternOf("gantt-table-thead")).toBe("table-thead");
    });

    test("matches real compound families", () => {
        expect(suffixPatternOf("five-star-rating-picker-button")).toBe("picker-button");
        expect(suffixPatternOf("five-star-rating-picker")).toBe("picker");
        expect(suffixPatternOf("theme-select-option")).toBe("select-option");
        expect(suffixPatternOf("theme-select")).toBe("select");
    });

    test("falls back to standalone for a leaf component with no suffix family", () => {
        expect(suffixPatternOf("badge")).toBe(STANDALONE_ID);
        expect(suffixPatternOf("hero")).toBe(STANDALONE_ID);
    });

    test("has a label for every id it can return, including every catalog slug", () => {
        for (const c of components) {
            const id = suffixPatternOf(c.slug);
            expect(SUFFIX_LABEL[id]).toBeTruthy();
        }
    });

    test("declares every pattern id exactly once", () => {
        const ids = SUFFIX_PATTERNS.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
