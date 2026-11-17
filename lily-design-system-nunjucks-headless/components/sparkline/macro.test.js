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

    it("breaks split the line, one polyline per comparable run", () => {
        const { document } = render("sparkline", {
            label: "Weight",
            values: [70, 71, 72, 80, 81],
            breaks: [3],
        });
        const lines = document.querySelectorAll(".sparkline svg polyline");
        expect(lines.length).toBe(2);
        expect(lines[0].getAttribute("points").split(" ").length).toBe(3);
        expect(lines[1].getAttribute("points").split(" ").length).toBe(2);
    });

    it("below minimumPoints there is no line, only the consumer's words as text", () => {
        const { document } = render("sparkline", {
            label: "Weight",
            values: [70, 71],
            minimumPoints: 3,
            insufficientLabel: "Not enough readings for a trend",
        });
        const root = document.querySelector(".sparkline");
        expect(root.hasAttribute("data-insufficient")).toBe(true);
        expect(root.getAttribute("role")).toBeNull();
        expect(root.querySelector("polyline")).toBeNull();
        expect(root.querySelector(".sparkline-insufficient").textContent).toBe(
            "Not enough readings for a trend",
        );
    });
});
