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

// Option groups (tasks.md P40-T4): in a <ul> listbox each group is a presentational <li> holding a <ul role="group">
// labelled by its heading; the options are found in document order through the groups.
describe("listbox option groups", () => {
    it("the arrows cross from one group to the next, and headings are not options", () => {
        const { document } = render(
            "listbox",
            { label: "Codes" },
            '<li role="presentation"><ul role="group" aria-labelledby="g-common"><li role="presentation" id="g-common">Common</li><li role="option" aria-selected="true">Apple</li><li role="option">Avocado</li></ul></li>' +
                '<li role="presentation"><ul role="group" aria-labelledby="g-lab"><li role="presentation" id="g-lab">Lab</li><li role="option">Banana</li><li role="option">Cherry</li></ul></li>',
        );
        autoInit(document);
        const options = [...document.querySelectorAll("[role='option']")];
        expect(options.map((o) => o.textContent)).toEqual(["Apple", "Avocado", "Banana", "Cherry"]);
        expect(options.map((o) => o.tabIndex)).toEqual([0, -1, -1, -1]);
        options[1].focus();
        on(options[1]).press("ArrowDown");
        expect(document.activeElement).toBe(options[2]);
        on(options[2]).press("ArrowUp");
        expect(document.activeElement).toBe(options[1]);
    });
});
