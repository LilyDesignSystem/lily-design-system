// age-view.test.js
// AgeView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.age-view");

describe("AgeView", () => {
    it("renders the element with its base class", async () => {
        await mount("age-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("age-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("age-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
