// as-saudiyah-raqm-al-huwiyah-al-wataniyah-view.test.js
// AsSaudiyahRaqmAlHuwiyahAlWataniyahView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahView", () => {
    it("renders the element with its base class", async () => {
        await mount("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
