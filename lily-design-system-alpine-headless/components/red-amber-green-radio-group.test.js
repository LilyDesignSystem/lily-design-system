// red-amber-green-radio-group.test.js
// RedAmberGreenRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.red-amber-green-radio-group");

describe("RedAmberGreenRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("red-amber-green-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("red-amber-green-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("red-amber-green-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});
