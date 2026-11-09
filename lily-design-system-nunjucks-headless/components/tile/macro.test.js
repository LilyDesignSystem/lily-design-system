import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tile", () => {
    it("renders a <div>, a group when labelled, as Svelte", () => {
        const { document } = render("tile", {
            label: "Analytics",
            heading: "Analytics",
            text: "Your numbers",
        });
        const el = document.querySelector("div.tile");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Analytics");
        expect(el.querySelector(".tile-heading").textContent).toBe("Analytics");
        expect(el.querySelector(".tile-text").textContent).toBe("Your numbers");
    });

    it("has no role or name without a label", () => {
        const el = render("tile", { heading: "H" }).document.querySelector(".tile");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("links the heading, not the whole tile, when href is given", () => {
        const { document } = render("tile", { href: "/plans", heading: "Plans" });
        expect(document.querySelector(".tile").tagName).toBe("DIV");
        expect(document.querySelector(".tile-heading a").getAttribute("href")).toBe("/plans");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("tile", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
