// al-imarat-raqm-al-huwiyah-input.test.js
// AlImaratRaqmAlHuwiyahInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.al-imarat-raqm-al-huwiyah-input");

describe("AlImaratRaqmAlHuwiyahInput", () => {
    it("renders the element with its base class", async () => {
        await mount("al-imarat-raqm-al-huwiyah-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("al-imarat-raqm-al-huwiyah-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("al-imarat-raqm-al-huwiyah-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
