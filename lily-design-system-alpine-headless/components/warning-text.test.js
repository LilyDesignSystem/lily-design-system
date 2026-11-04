// warning-text.test.js
// WarningText component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.warning-text");

describe("WarningText", () => {
    it("renders the element with its base class", async () => {
        await mount("warning-text");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("warning-text")).toBe(true);
    });

    it("uses the div element", async () => {
        await mount("warning-text");
        expect(el().tagName.toLowerCase()).toBe("div");
    });
    it("has no role", async () => {
        await mount("warning-text");
        expect(el().getAttribute("role")).toBeNull();
    });
    it("hides the icon and puts the hidden prefix and text in strong.warning-text-text", async () => {
        await mount("warning-text");
        expect(el().querySelector(":scope > .warning-text-icon").getAttribute("aria-hidden")).toBe(
            "true",
        );
        const strong = el().querySelector(":scope > strong.warning-text-text");
        expect(strong.querySelector(".screen-reader-span")).not.toBeNull();
    });
});
