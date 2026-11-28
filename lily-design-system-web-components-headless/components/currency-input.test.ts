import { afterEach, describe, expect, test } from "vitest";

import { CurrencyInput } from "./currency-input.js";

if (!customElements.get("lily-currency-input")) {
    customElements.define("lily-currency-input", CurrencyInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CurrencyInput", () => {
    test("renders a native input type=text with inputmode=decimal and the base class", () => {
        const host = render('<lily-currency-input label="Price"></lily-currency-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.inputMode).toBe("decimal");
        expect(input.classList.contains("currency-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-currency-input label="Price"></lily-currency-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Price");
    });

    test("never defaults currency-code: without it no data-currency-code is rendered", () => {
        const host = render('<lily-currency-input label="Price"></lily-currency-input>');

        expect(host.querySelector("input")!.hasAttribute("data-currency-code")).toBe(false);
        expect(host.innerHTML).not.toContain("USD");
    });

    test("currency-code attribute is reflected as data-currency-code", () => {
        const host = render(
            '<lily-currency-input label="Price" currency-code="GBP"></lily-currency-input>',
        );

        expect(host.querySelector("input")!.getAttribute("data-currency-code")).toBe("GBP");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render(
            '<lily-currency-input label="Price" value="19.99"></lily-currency-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("19.99");
    });

    test("exposes a live numeric value property, undefined when empty", () => {
        const host = render(
            '<lily-currency-input label="Price"></lily-currency-input>',
        ) as unknown as CurrencyInput;
        const input = host.querySelector("input") as HTMLInputElement;

        expect(host.value).toBeUndefined();

        host.value = 42.5;

        expect(input.value).toBe("42.5");
        expect(host.value).toBe(42.5);
    });

    test("required, disabled, min, and max propagate to the inner input", () => {
        const host = render(
            '<lily-currency-input label="Price" min="0" max="100" required disabled></lily-currency-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("100");
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});

describe("CurrencyInput follows its attributes (P50-T28)", () => {
    test("shows a change to its attributes, never overwriting what was typed", () => {
        const host = render(
            '<lily-currency-input label="Old" currency-code="EUR" value="1"></lily-currency-input>',
        );
        const input = host.querySelector("input") as HTMLInputElement;
        host.setAttribute("label", "New");
        host.setAttribute("currency-code", "JPY");
        host.setAttribute("min", "0");
        host.setAttribute("required", "");
        host.setAttribute("value", "2");
        host.setAttribute("class", "wide");
        expect(input.getAttribute("aria-label")).toBe("New");
        expect(input.getAttribute("data-currency-code")).toBe("JPY");
        expect(input.getAttribute("min")).toBe("0");
        expect(input.required).toBe(true);
        expect(input.value).toBe("2");
        expect(input.className).toBe("currency-input wide");
        input.value = "9";
        host.setAttribute("value", "3");
        expect(input.value).toBe("9");
        host.removeAttribute("currency-code");
        expect(input.hasAttribute("data-currency-code")).toBe(false);
    });
});
