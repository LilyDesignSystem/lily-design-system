// observation-view.test.js
// ObservationView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.observation-view");

describe("ObservationView", () => {
    it("renders the element with its base class", async () => {
        await mount("observation-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("observation-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("observation-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
