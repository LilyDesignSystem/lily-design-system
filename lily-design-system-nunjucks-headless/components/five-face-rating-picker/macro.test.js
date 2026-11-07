import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("five-face-rating-picker", () => {
    const name = "five-face-rating-picker";

    it("renders a <div role=radiogroup> with the base class", () => {
        const { document } = render(name, {});
        const el = document.querySelector(`div.${name}`);
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
    });

    it("has no English aria-label of its own", () => {
        const { document } = render(name, {});
        expect(document.querySelector(`div.${name}`).hasAttribute("aria-label")).toBe(false);
    });

    it("respects a custom label", () => {
        const { document } = render(name, {
            label: "How satisfied were you?",
        });
        expect(document.querySelector(`div.${name}`).getAttribute("aria-label")).toBe(
            "How satisfied were you?",
        );
    });

    it("renders caller block content", () => {
        const { document } = render(
            name,
            {},
            '<button class="five-face-rating-picker-button"></button>',
        );
        expect(document.querySelector(`div.${name} .five-face-rating-picker-button`)).toBeTruthy();
    });

    it("appends params.classes", () => {
        const { document } = render(name, { classes: "large" });
        expect(document.querySelector(`div.${name}.large`)).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render(name, {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("five-face-rating-picker keys", () => {
    it("is one radio group: arrows move, check and wrap", () => {
        const { document } = render(
            "five-face-rating-picker",
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
