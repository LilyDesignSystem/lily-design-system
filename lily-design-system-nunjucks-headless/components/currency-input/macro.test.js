import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("currency-input", () => {
    it("renders a <div> with a symbol and a text input", () => {
        const { document } = render("currency-input", {
            id: "amount",
            name: "amount",
            value: "12.50",
            label: "Amount",
            currencyCode: "GBP",
            currencySymbol: "£",
        });
        const wrap = document.querySelector("div.currency-input");
        expect(wrap).toBeTruthy();
        expect(wrap.querySelector(".currency-input-symbol").textContent.trim()).toBe("£");
        const input = wrap.querySelector("input.currency-input-value");
        expect(input.getAttribute("type")).toBe("text");
        expect(input.getAttribute("inputmode")).toBe("decimal");
        expect(input.getAttribute("value")).toBe("12.50");
    });

    it("renders the currencySymbol it is given", () => {
        const { document } = render("currency-input", { currencyCode: "USD", currencySymbol: "$" });
        expect(document.querySelector(".currency-input-symbol").textContent.trim()).toBe("$");
    });

    it("reflects currencyCode as data-currency-code", () => {
        const { document } = render("currency-input", { currencyCode: "JPY" });
        expect(
            document.querySelector("div.currency-input").getAttribute("data-currency-code"),
        ).toBe("JPY");
    });

    it("never defaults the currency: no code, no symbol, no USD or pound", () => {
        const { document, html } = render("currency-input", {});
        const wrap = document.querySelector("div.currency-input");
        expect(wrap.hasAttribute("data-currency-code")).toBe(false);
        expect(document.querySelector(".currency-input-symbol")).toBeNull();
        expect(html).not.toContain("USD");
        expect(html).not.toContain("£");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("currency-input", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
