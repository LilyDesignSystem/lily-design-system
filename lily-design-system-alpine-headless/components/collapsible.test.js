// collapsible.test.js
// Collapsible component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("details.collapsible");

describe("Collapsible", () => {
    it("renders the element with its base class", async () => {
        await mount("collapsible");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("collapsible")).toBe(true);
    });

    it("is a native disclosure, closed by default", async () => {
        await mount("collapsible");
        expect(el().open).toBe(false);
        expect(el().querySelector("summary.collapsible-summary")).not.toBeNull();
        expect(el().querySelector(".collapsible-body")).not.toBeNull();
    });
    it("opens from its summary", async () => {
        await mount("collapsible");
        el().querySelector("summary").click();
        expect(el().open).toBe(true);
    });
});
