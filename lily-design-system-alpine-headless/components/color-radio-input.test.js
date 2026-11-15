// color-radio-input.test.js
// ColorRadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.color-radio-input");

describe("ColorRadioInput", () => {
    it("renders the element with its base class", async () => {
        await mount("color-radio-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("color-radio-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("color-radio-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
