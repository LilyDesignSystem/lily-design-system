import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("color-picker", () => {
    it("renders a <div role=radiogroup>", () => {
        const { document } = render("color-picker", { label: "Colour" });
        const el = document.querySelector("div.color-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
        expect(el.getAttribute("aria-label")).toBe("Colour");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("color-picker", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("color-picker keys", () => {
    it("is one radio group: arrows move, check and wrap", () => {
        const { document } = render(
            "color-picker",
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
