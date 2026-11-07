import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("red-amber-green-picker", () => {
    it("renders a <div role=radiogroup> with the base class", () => {
        const { document } = render("red-amber-green-picker", { label: "Status" });
        const el = document.querySelector("div.red-amber-green-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
        expect(el.getAttribute("aria-label")).toBe("Status");
    });

    it("prefers aria-labelledby over aria-label", () => {
        const { document } = render("red-amber-green-picker", {
            label: "x",
            labelledBy: "h",
        });
        const el = document.querySelector("div.red-amber-green-picker");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("renders caller block content", () => {
        const { document } = render(
            "red-amber-green-picker",
            { label: "x" },
            '<button class="red-amber-green-picker-button">Red</button>',
        );
        expect(
            document.querySelector("div.red-amber-green-picker .red-amber-green-picker-button"),
        ).toBeTruthy();
    });

    it("appends params.classes", () => {
        const { document } = render("red-amber-green-picker", {
            label: "x",
            classes: "inline",
        });
        expect(document.querySelector("div.red-amber-green-picker.inline")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("red-amber-green-picker", { label: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("red-amber-green-picker keys", () => {
    it("is one radio group: arrows move, check and wrap", () => {
        const { document } = render(
            "red-amber-green-picker",
            { label: "Choice" },
            '<button type="button" role="radio" aria-checked="true">1</button>' +
                '<button type="button" role="radio" aria-checked="false">2</button>',
        );
        autoInit(document);
        const [one, two] = document.querySelectorAll("[role='radio']");
        on(one).press("ArrowRight");
        expect(document.activeElement).toBe(two);
        expect(two.getAttribute("aria-checked")).toBe("true");
        expect(one.getAttribute("aria-checked")).toBe("false");
        expect([one.tabIndex, two.tabIndex]).toEqual([-1, 0]);
        on(two).press("ArrowRight");
        expect(one.getAttribute("aria-checked")).toBe("true");
    });
});
