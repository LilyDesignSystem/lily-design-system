// measurement-unit-input.test.js
// MeasurementUnitInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.measurement-unit-input");

describe("MeasurementUnitInput", () => {
    it("renders the element with its base class", async () => {
        await mount("measurement-unit-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("measurement-unit-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("measurement-unit-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
