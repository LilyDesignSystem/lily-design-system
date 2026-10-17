import { describe, expect, it } from "vitest";
import { dependencyPath, weekdayOfEpochDay } from "./dependency-arrows";

const a = { left: 10, right: 50, top: 0, bottom: 20 };
const b = { left: 70, right: 120, top: 30, bottom: 50 };

describe("dependencyPath", () => {
    it("finish-to-start with room runs out, down and in", () => {
        expect(dependencyPath("e2s", a, b)).toBe("M50 10H58V40H70");
    });
    it("finish-to-start with no room goes round through the row gap", () => {
        const early = { left: 20, right: 60, top: 30, bottom: 50 };
        expect(dependencyPath("e2s", a, early)).toBe("M50 10H58V29H12V40H20");
    });
    it("start-to-start leaves and arrives on the left edges", () => {
        expect(dependencyPath("s2s", a, b)).toBe("M10 10H2V29H62V40H70");
    });
    it("end-to-end arrives at the successor's right edge, from outside it", () => {
        expect(dependencyPath("e2e", a, b)).toBe("M50 10H58V29H128V40H120");
    });
    it("start-to-end joins the predecessor's start to the successor's end", () => {
        expect(dependencyPath("s2e", a, b)).toBe("M10 10H2V29H128V40H120");
    });
    it("a predecessor below its successor routes in the gap under the target", () => {
        expect(dependencyPath("s2s", b, a)).toBe("M70 40H62V21H2V10H10");
    });
    it("same-row bars join with one line", () => {
        expect(dependencyPath("s2e", a, { left: 0, right: 5, top: 0, bottom: 20 })).toBe("M10 10H5");
    });
});

describe("weekdayOfEpochDay", () => {
    it("knows 1970-01-01 was a Thursday and 2026-01-03 a Saturday", () => {
        expect(weekdayOfEpochDay(0)).toBe(4);
        expect(weekdayOfEpochDay(-1)).toBe(3);
        expect(weekdayOfEpochDay(20456)).toBe(6);
    });
});
