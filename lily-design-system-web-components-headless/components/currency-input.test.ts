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

    test("defaults currency-code to USD, reflected as data-currency-code", () => {
        const host = render('<lily-currency-input label="Price"></lily-currency-input>');

        expect(host.querySelector("input")!.getAttribute("data-currency-code")).toBe("USD");
    });

    test("currency-code attribute overrides the default", () => {
        const host = render('<lily-currency-input label="Price" currency-code="GBP"></lily-currency-input>');

        expect(host.querySelector("input")!.getAttribute("data-currency-code")).toBe("GBP");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-currency-input label="Price" value="19.99"></lily-currency-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("19.99");
    });

    test("exposes a live numeric value property, undefined when empty", () => {
        const host = render('<lily-currency-input label="Price"></lily-currency-input>') as unknown as CurrencyInput;
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
