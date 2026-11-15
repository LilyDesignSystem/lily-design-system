import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-star-rating-radio-input", () => {
    it("renders an <input type=radio> with the base class", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "choice",
            value: "a",
        });
        const el = document.querySelector("input");
        expect(el.getAttribute("type")).toBe("radio");
        expect(el.classList.contains("five-star-rating-radio-input")).toBe(true);
    });

    it("sets id, name, and value", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "w-yes",
            name: "where",
            value: "yes",
        });
        const el = document.querySelector("input");
        expect(el.getAttribute("id")).toBe("w-yes");
        expect(el.getAttribute("name")).toBe("where");
        expect(el.getAttribute("value")).toBe("yes");
    });

    it("sets checked when params.checked is true", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "x",
            value: "a",
            checked: true,
        });
        expect(document.querySelector("input").hasAttribute("checked")).toBe(true);
    });

    it("sets required and disabled", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "x",
            value: "a",
            required: true,
            disabled: true,
        });
        const el = document.querySelector("input");
        expect(el.hasAttribute("required")).toBe(true);
        expect(el.hasAttribute("disabled")).toBe(true);
    });

    it("allows value='' (empty string) without omitting the attribute", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "x",
            value: "",
        });
        expect(document.querySelector("input").getAttribute("value")).toBe("");
    });

    it("appends params.classes", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "x",
            value: "a",
            classes: "extra",
        });
        expect(document.querySelector("input.five-star-rating-radio-input.extra")).toBeTruthy();
    });

    it("renders params.attributes", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "x",
            value: "a",
            attributes: { "data-track": "yes" },
        });
        expect(document.querySelector("input").getAttribute("data-track")).toBe("yes");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("five-star-rating-radio-input", {
            id: "a",
            name: "x",
            value: "a",
        });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
        expect(html).not.toContain("style=");
    });

    it("exposes its value in data-value for consumer CSS", () => {
        const { document } = render("five-star-rating-radio-input", {
            id: "a",
            name: "grp",
            value: "4",
        });
        expect(document.querySelector("input").getAttribute("data-value")).toBe("4");
    });
});
