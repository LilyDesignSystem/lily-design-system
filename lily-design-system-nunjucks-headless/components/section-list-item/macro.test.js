import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("section-list-item", () => {
    it("renders a <li> with the base class", () => {
        const { document } = render("section-list-item", { text: "Content" });
        const el = document.querySelector(".section-list-item");
        expect(el).toBeTruthy();
    });

    it("appends params.classes to the root element", () => {
        const { document } = render("section-list-item", { classes: "extra" });
        const el = document.querySelector(".section-list-item.extra");
        expect(el).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("section-list-item", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("never sets aria-label", () => {
        const { document } = render("section-list-item", { label: "Ignored" }, "x");
        expect(document.querySelector(".section-list-item").hasAttribute("aria-label")).toBe(false);
    });
});
