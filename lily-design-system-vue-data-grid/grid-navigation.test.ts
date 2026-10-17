import { describe, expect, test } from "vitest";

import { gridMove, pageStepFor, type GridNavigation } from "./grid-navigation";

const NAV: GridNavigation = { firstRow: 0, lastRow: 9, lastCol: 3, pageStep: 4 };
const at = { row: 5, col: 2 };

describe("gridMove", () => {
    test("arrows move one cell", () => {
        expect(gridMove({ key: "ArrowRight" }, at, NAV)).toEqual({ row: 5, col: 3 });
        expect(gridMove({ key: "ArrowLeft" }, at, NAV)).toEqual({ row: 5, col: 1 });
        expect(gridMove({ key: "ArrowDown" }, at, NAV)).toEqual({ row: 6, col: 2 });
        expect(gridMove({ key: "ArrowUp" }, at, NAV)).toEqual({ row: 4, col: 2 });
    });

    test("it clamps at the edges instead of wrapping", () => {
        expect(gridMove({ key: "ArrowRight" }, { row: 0, col: 3 }, NAV)).toEqual({ row: 0, col: 3 });
        expect(gridMove({ key: "ArrowUp" }, { row: 0, col: 0 }, NAV)).toEqual({ row: 0, col: 0 });
        expect(gridMove({ key: "PageDown" }, { row: 8, col: 0 }, NAV)).toEqual({ row: 9, col: 0 });
        expect(gridMove({ key: "PageUp" }, { row: 1, col: 0 }, NAV)).toEqual({ row: 0, col: 0 });
    });

    test("page keys move pageStep rows", () => {
        expect(gridMove({ key: "PageDown" }, at, NAV)).toEqual({ row: 9, col: 2 });
        expect(gridMove({ key: "PageUp" }, at, NAV)).toEqual({ row: 1, col: 2 });
    });

    test("Home and End go along the row by default, along the column with homeEnd=column", () => {
        expect(gridMove({ key: "Home" }, at, NAV)).toEqual({ row: 5, col: 0 });
        expect(gridMove({ key: "End" }, at, NAV)).toEqual({ row: 5, col: 3 });
        expect(gridMove({ key: "Home" }, at, { ...NAV, homeEnd: "column" })).toEqual({ row: 0, col: 2 });
        expect(gridMove({ key: "End" }, at, { ...NAV, homeEnd: "column" })).toEqual({ row: 9, col: 2 });
    });

    test("Ctrl or Cmd with Home and End go to the corners", () => {
        expect(gridMove({ key: "Home", ctrlKey: true }, at, NAV)).toEqual({ row: 0, col: 0 });
        expect(gridMove({ key: "End", metaKey: true }, at, NAV)).toEqual({ row: 9, col: 3 });
        expect(gridMove({ key: "Home", ctrlKey: true }, at, { ...NAV, homeEnd: "column" })).toEqual({ row: 0, col: 0 });
    });

    test("a header row at -1 is reachable when firstRow is -1", () => {
        expect(gridMove({ key: "Home", ctrlKey: true }, at, { ...NAV, firstRow: -1 })).toEqual({ row: -1, col: 0 });
        expect(gridMove({ key: "ArrowUp" }, { row: 0, col: 1 }, { ...NAV, firstRow: -1 })).toEqual({ row: -1, col: 1 });
    });

    test("right-to-left swaps ArrowLeft and ArrowRight only", () => {
        const rtl = { ...NAV, rtl: true };
        expect(gridMove({ key: "ArrowLeft" }, at, rtl)).toEqual({ row: 5, col: 3 });
        expect(gridMove({ key: "ArrowRight" }, at, rtl)).toEqual({ row: 5, col: 1 });
        expect(gridMove({ key: "ArrowDown" }, at, rtl)).toEqual({ row: 6, col: 2 });
        expect(gridMove({ key: "Home" }, at, rtl)).toEqual({ row: 5, col: 0 });
    });

    test("any other key is not a movement key", () => {
        for (const key of ["Enter", " ", "F2", "s", "Tab", "Escape"]) expect(gridMove({ key }, at, NAV)).toBeNull();
    });

    test("an empty grid keeps the cursor at the last row bound", () => {
        expect(gridMove({ key: "ArrowDown" }, { row: 0, col: 0 }, { ...NAV, lastRow: -1, lastCol: 0 })).toEqual({ row: -1, col: 0 });
    });
});

describe("pageStepFor", () => {
    test("a virtualized viewport pages by the rows that fit, at least one", () => {
        expect(pageStepFor({ height: 300, rowHeight: 30 })).toBe(10);
        expect(pageStepFor({ height: 10, rowHeight: 30 })).toBe(1);
    });
    test("otherwise the fallback", () => {
        expect(pageStepFor(undefined)).toBe(10);
        expect(pageStepFor(undefined, 25)).toBe(25);
    });
});
