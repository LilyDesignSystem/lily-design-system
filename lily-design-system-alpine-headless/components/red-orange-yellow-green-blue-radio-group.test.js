// red-orange-yellow-green-blue-radio-group.test.js
// RedOrangeYellowGreenBlueRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.red-orange-yellow-green-blue-radio-group");

describe("RedOrangeYellowGreenBlueRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("red-orange-yellow-green-blue-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("red-orange-yellow-green-blue-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("red-orange-yellow-green-blue-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});
