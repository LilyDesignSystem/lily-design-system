import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("context-menu", () => {
    it("renders a <ul role=menu> with the base class", () => {
        const { document } = render("context-menu", { label: "X" });
        const el = document.querySelector("ul.context-menu");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("menu");
        expect(el.getAttribute("aria-label")).toBe("X");
    });

    it("has no English default label", () => {
        const { document } = render("context-menu", {});
        expect(document.querySelector("ul.context-menu").hasAttribute("aria-label")).toBe(false);
    });

    it("is a popover=auto for the consumer's showPopover(), or shown in place when open", () => {
        const closed = render("context-menu", { label: "X" }).document.querySelector("ul");
        expect(closed.getAttribute("popover")).toBe("auto");
        expect(closed.hasAttribute("hidden")).toBe(false);
        const open = render("context-menu", { label: "X", open: true }).document.querySelector(
            "ul",
        );
        expect(open.hasAttribute("popover")).toBe(false);
    });

    it("prefers labelledBy over label", () => {
        const { document } = render("context-menu", { label: "x", labelledBy: "h" });
        const el = document.querySelector("ul.context-menu");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("renders caller content", () => {
        const { document } = render("context-menu", { label: "x" }, '<span class="child"></span>');
        expect(document.querySelector("ul.context-menu .child")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("context-menu", { label: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
