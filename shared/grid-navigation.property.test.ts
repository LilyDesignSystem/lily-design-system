// Property tests (fast-check): whatever key is pressed, from wherever, the cursor stays inside the grid, and
// right-to-left only swaps ArrowLeft and ArrowRight.
import fc from "fast-check";
import { describe, expect, test } from "vitest";

import { type GridNavigation, gridMove } from "./grid-navigation";

const MOVEMENT = [
    "ArrowRight",
    "ArrowLeft",
    "ArrowDown",
    "ArrowUp",
    "PageDown",
    "PageUp",
    "Home",
    "End",
];

const grid = fc
    .record({
        header: fc.boolean(),
        lastRow: fc.integer({ min: 0, max: 50 }),
        lastCol: fc.integer({ min: 0, max: 20 }),
        pageStep: fc.integer({ min: 1, max: 30 }),
        homeEnd: fc.constantFrom<"row" | "column">("row", "column"),
        rtl: fc.boolean(),
    })
    .map(({ header, ...nav }): GridNavigation => ({ firstRow: header ? -1 : 0, ...nav }));

const withPosition = grid.chain((nav) =>
    fc.record({
        nav: fc.constant(nav),
        at: fc.record({
            row: fc.integer({ min: nav.firstRow, max: nav.lastRow }),
            col: fc.integer({ min: 0, max: nav.lastCol }),
        }),
        key: fc.constantFrom(...MOVEMENT),
        ctrlKey: fc.boolean(),
    }),
);

describe("grid-navigation (properties)", () => {
    test("a movement key always lands inside the grid", () => {
        fc.assert(
            fc.property(withPosition, ({ nav, at, key, ctrlKey }) => {
                const to = gridMove({ key, ctrlKey }, at, nav)!;
                expect(to).not.toBeNull();
                expect(to.row).toBeGreaterThanOrEqual(nav.firstRow);
                expect(to.row).toBeLessThanOrEqual(nav.lastRow);
                expect(to.col).toBeGreaterThanOrEqual(0);
                expect(to.col).toBeLessThanOrEqual(nav.lastCol);
            }),
        );
    });

    test("any other key is not a movement", () => {
        fc.assert(
            fc.property(
                withPosition,
                fc.string().filter((k) => !MOVEMENT.includes(k)),
                ({ nav, at }, key) => gridMove({ key }, at, nav) === null,
            ),
        );
    });

    test("right-to-left swaps ArrowLeft and ArrowRight and nothing else", () => {
        fc.assert(
            fc.property(withPosition, ({ nav, at, key, ctrlKey }) => {
                const swapped =
                    key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
                const rtl = gridMove({ key, ctrlKey }, at, { ...nav, rtl: true });
                const ltr = gridMove({ key: swapped, ctrlKey }, at, { ...nav, rtl: false });
                expect(rtl).toEqual(ltr);
            }),
        );
    });

    test("ArrowRight then ArrowLeft returns to the start unless the first move hit the edge", () => {
        fc.assert(
            fc.property(withPosition, ({ nav, at }) => {
                const ltr = { ...nav, rtl: false };
                const right = gridMove({ key: "ArrowRight" }, at, ltr)!;
                const back = gridMove({ key: "ArrowLeft" }, right, ltr)!;
                if (at.col < nav.lastCol) expect(back).toEqual(at);
            }),
        );
    });
});
