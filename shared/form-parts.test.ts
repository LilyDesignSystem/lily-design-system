import { describe, expect, it } from "vitest";
import { FormPartsError, quantityProblem } from "./form-parts.js";

// What the vectors cannot say: JSON has no NaN or Infinity, so a limit that is not a finite number is checked here. Each port
// throws the same "limit" reason for it (tasks.md P62-T3).
describe("quantityProblem with a limit that is not a finite number", () => {
    for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
        it(`throws "limit" for a min of ${String(bad)}`, () => {
            expect(() => quantityProblem("5", bad, null)).toThrow(FormPartsError);
            expect(() => quantityProblem("5", bad, null)).toThrow(
                expect.objectContaining({ reason: "limit" }),
            );
        });
        it(`throws "limit" for a max of ${String(bad)}`, () => {
            expect(() => quantityProblem("5", null, bad)).toThrow(
                expect.objectContaining({ reason: "limit" }),
            );
        });
    }
});
