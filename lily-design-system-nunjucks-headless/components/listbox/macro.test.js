import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("listbox", () => {
    it("renders a <ul role=listbox>", () => {
        const { document } = render("listbox", { label: "Colours" });
        const el = document.querySelector("ul.listbox");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("listbox");
        expect(el.getAttribute("aria-label")).toBe("Colours");
    });

    it("supports multiselectable", () => {
        const { document } = render("listbox", { multiselectable: true });
        expect(document.querySelector("ul").getAttribute("aria-multiselectable")).toBe("true");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("listbox", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("listbox keys", () => {
    it("is one tab stop, moves, wraps and jumps", () => {
        const { document } = render(
            "listbox",
            { label: "Fruit" },
            '<li role="option">A</li><li role="option" aria-selected="true">B</li>',
        );
        autoInit(document);
        const [a, b] = document.querySelectorAll("[role='option']");
        expect([a.tabIndex, b.tabIndex]).toEqual([-1, 0]);
        on(b).press("ArrowDown");
        expect(document.activeElement).toBe(a);
        on(a).press("ArrowUp");
        expect(document.activeElement).toBe(b);
        on(b).press("Home");
        expect(document.activeElement).toBe(a);
    });
});
