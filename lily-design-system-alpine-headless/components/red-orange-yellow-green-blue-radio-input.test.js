// red-orange-yellow-green-blue-radio-input.test.js
// RedOrangeYellowGreenBlueRadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.red-orange-yellow-green-blue-radio-input");

describe("RedOrangeYellowGreenBlueRadioInput", () => {
    it("renders the element with its base class", async () => {
        await mount("red-orange-yellow-green-blue-radio-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("red-orange-yellow-green-blue-radio-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("red-orange-yellow-green-blue-radio-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
