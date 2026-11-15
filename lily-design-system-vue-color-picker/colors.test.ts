import { describe, expect, test } from "vitest";
import {
    CSS_NAMED_COLORS,
    defaultPalette,
    hexToHsl,
    hexToRgb,
    hslToHex,
    nameOfColor,
    normalizeHex,
    parseColor,
    pushRecent,
    rgbToHex,
    hexToHsb,
    hsbToHex,
    hexToCmyk,
    cmykToHex,
} from "./colors";

describe("colors", () => {
    test("has the 148 CSS named colours, each a lowercase #rrggbb", () => {
        const entries = Object.entries(CSS_NAMED_COLORS);
        expect(entries).toHaveLength(148);
        for (const [name, hex] of entries) {
            expect(name).toBe(name.toLowerCase());
            expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        }
        expect(CSS_NAMED_COLORS.rebeccapurple).toBe("#663399");
    });

    test("normalizes hex in its short and long forms, and refuses the rest", () => {
        expect(normalizeHex("#ABC")).toBe("#aabbcc");
        expect(normalizeHex("005EB8")).toBe("#005eb8");
        expect(normalizeHex(" #005eb8 ")).toBe("#005eb8");
        for (const bad of ["", "#12", "#12345", "#gggggg", "blue"])
            expect(normalizeHex(bad)).toBeNull();
    });

    test("converts between hex, RGB and HSL", () => {
        expect(hexToRgb("#005eb8")).toEqual({ r: 0, g: 94, b: 184 });
        expect(rgbToHex({ r: 0, g: 94, b: 184 })).toBe("#005eb8");
        expect(hexToHsl("#ff0000")).toEqual({ h: 0, s: 100, l: 50 });
        expect(hslToHex({ h: 120, s: 100, l: 25 })).toBe("#008000");
        expect(hslToHex({ h: 0, s: 0, l: 100 })).toBe("#ffffff");
        expect(hslToHex({ h: 480, s: 100, l: 50 })).toBe(hslToHex({ h: 120, s: 100, l: 50 }));
    });

    test("converts between hex, HSB and CMYK", () => {
        expect(hexToHsb("#ff0000")).toEqual({ h: 0, s: 100, b: 100 });
        expect(hexToHsb("#008000")).toEqual({ h: 120, s: 100, b: 50 });
        expect(hexToHsb("#000000")).toEqual({ h: 0, s: 0, b: 0 });
        expect(hsbToHex({ h: 240, s: 100, b: 100 })).toBe("#0000ff");
        expect(hsbToHex({ h: 0, s: 0, b: 100 })).toBe("#ffffff");
        expect(hsbToHex({ h: 120, s: 100, b: 50 })).toBe("#008000");
        expect(hsbToHex({ h: 30, s: 50, b: 40 })).toBe("#664d33");
        expect(hexToCmyk("#ff0000")).toEqual({ c: 0, m: 100, y: 100, k: 0 });
        expect(hexToCmyk("#000000")).toEqual({ c: 0, m: 0, y: 0, k: 100 });
        expect(hexToCmyk("#005eb8")).toEqual({ c: 100, m: 49, y: 0, k: 28 });
        expect(cmykToHex({ c: 0, m: 0, y: 0, k: 0 })).toBe("#ffffff");
        expect(cmykToHex({ c: 100, m: 0, y: 100, k: 50 })).toBe("#008000");
    });

    test("names a colour that has a CSS name, and only then", () => {
        expect(nameOfColor("#00ffff")).toBe("aqua");
        expect(nameOfColor("#663399")).toBe("rebeccapurple");
        expect(nameOfColor("#005eb8")).toBeNull();
    });

    test("reads what a person types", () => {
        expect(parseColor("Tomato")).toBe("#ff6347");
        expect(parseColor("#f00")).toBe("#ff0000");
        expect(parseColor("rgb(0, 94, 184)")).toBe("#005eb8");
        expect(parseColor("rgb(0 94 184)")).toBe("#005eb8");
        expect(parseColor("hsl(120 100% 25%)")).toBe("#008000");
        expect(parseColor("hsl(120deg, 100%, 25%)")).toBe("#008000");
        expect(parseColor("transparent")).toBe("transparent");
        for (const bad of [
            "",
            "notacolour",
            "rgb(300, 0, 0)",
            "hsl(0, 150%, 50%)",
            "rgb(10%, 0, 0)",
        ]) {
            expect(parseColor(bad)).toBeNull();
        }
    });

    test("the default palette is 8 rows of 10 distinct colours, greys first", () => {
        const p = defaultPalette();
        expect(p).toHaveLength(80);
        expect(new Set(p).size).toBe(80);
        expect(p[0]).toBe("#000000");
        expect(p[9]).toBe("#ffffff");
        for (const c of p) expect(c).toMatch(/^#[0-9a-f]{6}$/);
    });

    test("recent keeps the newest first, without repeats, up to the limit", () => {
        expect(pushRecent(["#111111", "#222222"], "#333333")).toEqual([
            "#333333",
            "#111111",
            "#222222",
        ]);
        expect(pushRecent(["#111111", "#222222"], "#222222")).toEqual(["#222222", "#111111"]);
        const many = Array.from({ length: 10 }, (_, i) => `#00000${i}`);
        expect(pushRecent(many, "#ffffff")).toHaveLength(10);
        expect(pushRecent(many, "#ffffff", 3)).toEqual(["#ffffff", "#000000", "#000001"]);
    });
});
