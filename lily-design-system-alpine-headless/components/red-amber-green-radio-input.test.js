// red-amber-green-radio-input.test.js
// RedAmberGreenRadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.red-amber-green-radio-input");

describe("RedAmberGreenRadioInput", () => {
    it("renders the element with its base class", async () => {
        await mount("red-amber-green-radio-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("red-amber-green-radio-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("red-amber-green-radio-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
