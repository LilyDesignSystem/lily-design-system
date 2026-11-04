import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("command", () => {
    it("renders a search region with an input and a listbox", () => {
        const { document } = render("command", { id: "c", label: "Actions" });
        const el = document.querySelector("div.command");
        expect(el.getAttribute("role")).toBe("search");
        expect(el.getAttribute("aria-label")).toBe("Actions");
        const input = el.querySelector('input[type="search"]');
        const list = el.querySelector('[role="listbox"]');
        expect(input.getAttribute("aria-controls")).toBe(list.id);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("command", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
