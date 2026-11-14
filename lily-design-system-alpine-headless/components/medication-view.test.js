// medication-view.test.js
// MedicationView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.medication-view");

describe("MedicationView", () => {
    it("renders the element with its base class", async () => {
        await mount("medication-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("medication-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("medication-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
