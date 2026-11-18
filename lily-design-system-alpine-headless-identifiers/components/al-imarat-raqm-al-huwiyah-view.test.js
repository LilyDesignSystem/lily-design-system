// al-imarat-raqm-al-huwiyah-view.test.js
// AlImaratRaqmAlHuwiyahView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.al-imarat-raqm-al-huwiyah-view");

describe("AlImaratRaqmAlHuwiyahView", () => {
    it("renders the element with its base class", async () => {
        await mount("al-imarat-raqm-al-huwiyah-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("al-imarat-raqm-al-huwiyah-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("al-imarat-raqm-al-huwiyah-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
