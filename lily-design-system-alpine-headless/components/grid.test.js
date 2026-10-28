// grid.test.js
// Grid component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.grid");

describe("Grid", () => {
    it("renders the element with its base class", async () => {
        await mount("grid");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("grid")).toBe(true);
    });

    it("uses the div element", async () => {
        await mount("grid");
        expect(el().tagName.toLowerCase()).toBe("div");
    });

    it("documents the fluid minColumnWidth template", async () => {
        const { readFileSync } = await import("node:fs");
        const text = readFileSync("components/grid.html", "utf8");
        expect(text).toContain("repeat(auto-fit, minmax(min(W, 100%), 1fr))");
        expect(text).toContain("data-min-column-width");
    });
});
