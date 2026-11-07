import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("five-star-rating-picker", () => {
    it("renders a <div role=radiogroup> with the base class", () => {
        const { document } = render("five-star-rating-picker", {});
        const el = document.querySelector("div.five-star-rating-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
    });

    it("without a label, renders no English aria-label", () => {
        const { document } = render("five-star-rating-picker", {});
        expect(
            document.querySelector("div.five-star-rating-picker").hasAttribute("aria-label"),
        ).toBe(false);
    });

    it("respects a custom label", () => {
        const { document } = render("five-star-rating-picker", {
            label: "How satisfied are you?",
        });
        expect(
            document.querySelector("div.five-star-rating-picker").getAttribute("aria-label"),
        ).toBe("How satisfied are you?");
    });

    it("uses aria-labelledby when provided", () => {
        const { document } = render("five-star-rating-picker", {
            labelledBy: "q1",
        });
        const el = document.querySelector("div.five-star-rating-picker");
        expect(el.getAttribute("aria-labelledby")).toBe("q1");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("renders caller block content", () => {
        const { document } = render(
            "five-star-rating-picker",
            {},
            '<button class="five-star-rating-picker-button"></button>',
        );
        expect(
            document.querySelector("div.five-star-rating-picker .five-star-rating-picker-button"),
        ).toBeTruthy();
    });

    it("appends params.classes", () => {
        const { document } = render("five-star-rating-picker", { classes: "large" });
        expect(document.querySelector("div.five-star-rating-picker.large")).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("five-star-rating-picker", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("five-star-rating-picker keys", () => {
    it("is one radio group: arrows move, check and wrap", () => {
        const { document } = render(
            "five-star-rating-picker",
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
