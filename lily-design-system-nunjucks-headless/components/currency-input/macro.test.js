import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("currency-input", () => {
    it("renders a bare <input type=text> with the base class, as Svelte", () => {
        const { document } = render("currency-input", {
            id: "m",
            name: "m",
            value: "5",
            label: "Amount",
        });
        const el = document.querySelector("input.currency-input");
        expect(el.getAttribute("type")).toBe("text");
        expect(el.getAttribute("aria-label")).toBe("Amount");
        expect(el.getAttribute("name")).toBe("m");
        expect(el.getAttribute("value")).toBe("5");
    });

    it("supports required, disabled and invalid", () => {
        const el = render("currency-input", {
            required: true,
            disabled: true,
            invalid: true,
        }).document.querySelector("input");
        expect(el.hasAttribute("required")).toBe(true);
        expect(el.hasAttribute("disabled")).toBe(true);
        expect(el.getAttribute("aria-invalid")).toBe("true");
    });

    it("is decimal, and reflects currencyCode as data-currency-code", () => {
        const el = render("currency-input", { currencyCode: "JPY" }).document.querySelector(
            "input",
        );
        expect(el.getAttribute("inputmode")).toBe("decimal");
        expect(el.dataset.currencyCode).toBe("JPY");
    });

    it("never defaults the currency: no code, no symbol, no USD or pound", () => {
        const { html, document } = render("currency-input", {});
        expect(document.querySelector("input").hasAttribute("data-currency-code")).toBe(false);
        expect(html).not.toMatch(/USD|GBP|\$|£/);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("currency-input", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
