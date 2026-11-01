// as-saudiyah-raqm-al-huwiyah-al-wataniyah-input.test.js
// AsSaudiyahRaqmAlHuwiyahAlWataniyahInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.as-saudiyah-raqm-al-huwiyah-al-wataniyah-input");

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahInput", () => {
    it("renders the element with its base class", async () => {
        await mount("as-saudiyah-raqm-al-huwiyah-al-wataniyah-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("as-saudiyah-raqm-al-huwiyah-al-wataniyah-input")).toBe(
            true,
        );
    });

    it("uses the input element", async () => {
        await mount("as-saudiyah-raqm-al-huwiyah-al-wataniyah-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
