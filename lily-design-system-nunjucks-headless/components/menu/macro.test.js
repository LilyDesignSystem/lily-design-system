import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("menu", () => {
    it("renders a <div role=menu> with the base class", () => {
        const { document } = render("menu", { label: "X" });
        const el = document.querySelector("div.menu");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("menu");
        expect(el.getAttribute("aria-label")).toBe("X");
    });

    it("has no default name: the words are the consumer's", () => {
        const { document } = render("menu", {});
        expect(document.querySelector("div.menu").hasAttribute("aria-label")).toBe(false);
    });

    it("prefers labelledBy over label", () => {
        const { document } = render("menu", { label: "x", labelledBy: "h" });
        const el = document.querySelector("div.menu");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("renders caller content", () => {
        const { document } = render("menu", { label: "x" }, '<span class="child"></span>');
        expect(document.querySelector("div.menu .child")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("menu", { label: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
