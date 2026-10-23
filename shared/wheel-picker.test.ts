import { describe, expect, test } from "vitest";
import { isWheelTypeaheadKey, nextWheelIndex, nextWheelPrefix, wheelTypeaheadIndex, type WheelOption } from "./wheel-picker";

const opts = (labels: string[], disabled: number[] = []): WheelOption[] =>
    labels.map((label, i) => ({ value: String(i), label, disabled: disabled.includes(i) }));
const months = opts(["January", "February", "March", "April", "May", "June"]);

describe("nextWheelIndex", () => {
    test("arrows move one enabled option", () => {
        expect(nextWheelIndex(months, 1, "ArrowDown")).toBe(2);
        expect(nextWheelIndex(months, 1, "ArrowUp")).toBe(0);
    });

    test("arrows stop at the ends unless looping", () => {
        expect(nextWheelIndex(months, 5, "ArrowDown")).toBe(5);
        expect(nextWheelIndex(months, 0, "ArrowUp")).toBe(0);
        expect(nextWheelIndex(months, 5, "ArrowDown", { loop: true })).toBe(0);
        expect(nextWheelIndex(months, 0, "ArrowUp", { loop: true })).toBe(5);
    });

    test("Home and End jump to the first and last enabled, never wrapping", () => {
        const o = opts(["a", "b", "c", "d"], [0, 3]);
        expect(nextWheelIndex(o, 2, "Home", { loop: true })).toBe(1);
        expect(nextWheelIndex(o, 1, "End", { loop: true })).toBe(2);
    });

    test("PageDown and PageUp move by pageSize enabled options and clamp", () => {
        expect(nextWheelIndex(months, 0, "PageDown", { pageSize: 2 })).toBe(2);
        expect(nextWheelIndex(months, 4, "PageDown", { pageSize: 5 })).toBe(5);
        expect(nextWheelIndex(months, 1, "PageUp", { pageSize: 5, loop: true })).toBe(0);
    });

    test("disabled options are skipped", () => {
        const o = opts(["a", "b", "c", "d"], [1, 2]);
        expect(nextWheelIndex(o, 0, "ArrowDown")).toBe(3);
        expect(nextWheelIndex(o, 3, "ArrowUp")).toBe(0);
    });

    test("with nothing selected, Down chooses the first and Up the last enabled", () => {
        const o = opts(["a", "b", "c"], [0]);
        expect(nextWheelIndex(o, -1, "ArrowDown")).toBe(1);
        expect(nextWheelIndex(o, -1, "ArrowUp")).toBe(2);
        expect(nextWheelIndex(o, -1, "PageDown")).toBe(1);
    });

    test("a disabled current index is treated as nothing selected", () => {
        const o = opts(["a", "b", "c"], [1]);
        expect(nextWheelIndex(o, 1, "ArrowDown")).toBe(0);
    });

    test("returns -1 when no option can be selected", () => {
        expect(nextWheelIndex(opts(["a", "b"], [0, 1]), 0, "ArrowDown")).toBe(-1);
        expect(nextWheelIndex([], -1, "Home")).toBe(-1);
    });
});

describe("type-ahead", () => {
    test("moves to the next option starting with the letter, wrapping, skipping the current one", () => {
        const o = opts(["Monday", "Tuesday", "Thursday", "Friday", "Tuesday"]);
        expect(wheelTypeaheadIndex(o, 0, "t")).toBe(1);
        expect(wheelTypeaheadIndex(o, 1, "t")).toBe(2);
        expect(wheelTypeaheadIndex(o, 4, "m")).toBe(0);
    });

    test("a growing prefix may stay on the current option", () => {
        const o = opts(["Thursday", "Tuesday"]);
        expect(wheelTypeaheadIndex(o, 0, "th")).toBe(0);
        expect(wheelTypeaheadIndex(o, 0, "tu")).toBe(1);
    });

    test("a repeated letter steps through the options that start with it", () => {
        const o = opts(["Sat", "Sun", "Mon"]);
        expect(wheelTypeaheadIndex(o, 0, "ss")).toBe(1);
    });

    test("ignores case and diacritics, and skips disabled options", () => {
        const o = opts(["Zoé", "Zebra", "Zoo"], [0]);
        expect(wheelTypeaheadIndex(o, -1, "ZO")).toBe(2);
        expect(wheelTypeaheadIndex(opts(["École", "Eve"]), -1, "e")).toBe(0);
    });

    test("returns -1 for no match or an empty prefix", () => {
        expect(wheelTypeaheadIndex(months, 0, "x")).toBe(-1);
        expect(wheelTypeaheadIndex(months, 0, "")).toBe(-1);
    });

    test("the prefix grows within the reset time and starts over after it", () => {
        const a = nextWheelPrefix({ prefix: "", at: 0 }, "t", 100);
        const b = nextWheelPrefix(a, "h", 400);
        expect(b.prefix).toBe("th");
        expect(nextWheelPrefix(b, "u", 2000).prefix).toBe("u");
    });

    test("only printable characters without modifiers are type-ahead keys", () => {
        expect(isWheelTypeaheadKey({ key: "a" })).toBe(true);
        expect(isWheelTypeaheadKey({ key: " " })).toBe(false);
        expect(isWheelTypeaheadKey({ key: "Enter" })).toBe(false);
        expect(isWheelTypeaheadKey({ key: "a", ctrlKey: true })).toBe(false);
    });
});
