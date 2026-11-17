// duration-view.test.js
// DurationView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("time.duration-view");

describe("DurationView", () => {
    it("renders the element with its base class", async () => {
        await mount("duration-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("duration-view")).toBe(true);
    });

    it("uses the time element", async () => {
        await mount("duration-view");
        expect(el().tagName.toLowerCase()).toBe("time");
    });
});
