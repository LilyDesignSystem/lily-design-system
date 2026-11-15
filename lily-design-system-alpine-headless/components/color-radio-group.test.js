// color-radio-group.test.js
// ColorRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.color-radio-group");

describe("ColorRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("color-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("color-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("color-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});
