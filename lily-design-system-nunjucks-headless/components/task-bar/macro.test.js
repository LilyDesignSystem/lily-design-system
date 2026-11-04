import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("task-bar", () => {
    it("renders a <div role=toolbar> with the base class", () => {
        const { document } = render("task-bar", { label: "X" });
        const el = document.querySelector("div.task-bar");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("toolbar");
        expect(el.getAttribute("aria-label")).toBe("X");
    });

    it("has no default name: the words are the consumer's", () => {
        const { document } = render("task-bar", {});
        expect(document.querySelector("div").hasAttribute("aria-label")).toBe(false);
    });

    it("prefers labelledBy over label", () => {
        const { document } = render("task-bar", { label: "x", labelledBy: "h" });
        const el = document.querySelector("div.task-bar");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("renders caller content", () => {
        const { document } = render("task-bar", { label: "x" }, '<span class="child"></span>');
        expect(document.querySelector("div.task-bar .child")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("task-bar", { label: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
