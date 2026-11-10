import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("sparkline", () => {
    it("renders a <span role=img> holding an aria-hidden <svg> polyline, as Svelte", () => {
        const { document } = render("sparkline", {
            values: [1, 3, 2],
            label: "Rising, then a dip",
        });
        const el = document.querySelector("span.sparkline");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Rising, then a dip");
        const svg = el.querySelector("svg");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(svg.querySelector("polyline").getAttribute("points").split(" ")).toHaveLength(3);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("sparkline", { values: [1, 2] });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
