// Property tests (fast-check): every colour model the colour picker offers converts to hex and back without drift.
// The example-based tests in colors.test.ts pin known values; these check the conversions hold for any colour.
import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
    cmykToRgb,
    hexToRgb,
    hslToRgb,
    hsbToRgb,
    normalizeHex,
    parseColor,
    rgbToCmyk,
    rgbToHex,
    rgbToHsb,
    rgbToHsl,
} from "./colors";

const channel = fc.integer({ min: 0, max: 255 });
const rgb = fc.record({ r: channel, g: channel, b: channel });
const hex6 = fc
    .array(fc.constantFrom(..."0123456789abcdefABCDEF"), { minLength: 6, maxLength: 6 })
    .map((digits) => digits.join(""));

/**
 * Each channel within `steps` of the original. The models are shown in whole units (degrees, percent), so a round trip
 * drifts by rounding alone: half a percent of 255 is 1.275 steps for each rounded percentage, and half a degree of hue
 * moves a channel by up to 255 × 0.5 / 60 = 2.125. HSL and HSB round a hue and two percentages (at most 4.675), CMYK
 * two percentages per channel (2.55). Measured on a grid of every third value: HSL 4.5, HSB 3.2, CMYK 2.2.
 */
const near =
    (steps: number) =>
    (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) =>
        Math.abs(a.r - b.r) <= steps &&
        Math.abs(a.g - b.g) <= steps &&
        Math.abs(a.b - b.b) <= steps;

describe("colors (properties)", () => {
    test("hex to RGB to hex is the identity on normalized hex", () => {
        fc.assert(
            fc.property(hex6, (digits) => {
                const hex = normalizeHex(digits)!;
                expect(rgbToHex(hexToRgb(hex)!)).toBe(hex);
            }),
        );
    });

    test("normalizeHex accepts any case, with or without #, and is idempotent", () => {
        fc.assert(
            fc.property(hex6, fc.boolean(), (digits, hash) => {
                const once = normalizeHex((hash ? "#" : "") + digits);
                expect(once).toMatch(/^#[0-9a-f]{6}$/);
                expect(normalizeHex(once!)).toBe(once);
            }),
        );
    });

    test("RGB to HSL to RGB drifts by rounding only, at most 5 steps per channel", () => {
        fc.assert(fc.property(rgb, (c) => near(5)(hslToRgb(rgbToHsl(c)), c)));
    });

    test("RGB to HSB to RGB drifts by rounding only, at most 5 steps per channel", () => {
        fc.assert(fc.property(rgb, (c) => near(5)(hsbToRgb(rgbToHsb(c)), c)));
    });

    test("RGB to CMYK to RGB drifts by rounding only, at most 3 steps per channel", () => {
        fc.assert(fc.property(rgb, (c) => near(3)(cmykToRgb(rgbToCmyk(c)), c)));
    });

    test("every model's components stay in range", () => {
        fc.assert(
            fc.property(rgb, (c) => {
                const hsl = rgbToHsl(c);
                const hsb = rgbToHsb(c);
                const cmyk = rgbToCmyk(c);
                const inRange = (n: number, hi: number) => n >= 0 && n <= hi;
                return (
                    inRange(hsl.h, 360) &&
                    inRange(hsl.s, 100) &&
                    inRange(hsl.l, 100) &&
                    inRange(hsb.h, 360) &&
                    inRange(hsb.s, 100) &&
                    inRange(hsb.b, 100) &&
                    [cmyk.c, cmyk.m, cmyk.y, cmyk.k].every((n) => inRange(n, 100))
                );
            }),
        );
    });

    test("a three-digit hex is the six-digit one with each digit doubled", () => {
        const digit = fc.constantFrom(..."0123456789abcdefABCDEF");
        fc.assert(
            fc.property(fc.tuple(digit, digit, digit), ([r, g, b]) => {
                expect(normalizeHex(r + g + b)).toBe(normalizeHex(r + r + g + g + b + b));
            }),
        );
    });

    test("parseColor of any hex gives its normalized form", () => {
        fc.assert(fc.property(hex6, (digits) => parseColor(digits) === normalizeHex(digits)));
    });
});
