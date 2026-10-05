import { afterEach, describe, expect, test } from "vitest";

import { OneTimePasswordInput } from "./one-time-password-input.js";

if (!customElements.get("lily-one-time-password-input")) {
    customElements.define("lily-one-time-password-input", OneTimePasswordInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASE = '<lily-one-time-password-input label="Verification code" length="6"></lily-one-time-password-input>';

describe("OneTimePasswordInput", () => {
    test("renders ONE native text input with the base class", () => {
        const host = render(BASE);
        const inputs = host.querySelectorAll("input");
        expect(inputs.length).toBe(1);
        expect(inputs[0].type).toBe("text");
        expect(inputs[0].className).toBe("one-time-password-input");
    });

    test("has aria-label from label", () => {
        expect(render(BASE).querySelector("input")!.getAttribute("aria-label")).toBe("Verification code");
    });

    test("is autofill-ready: one-time-code, numeric keypad", () => {
        const input = render(BASE).querySelector("input")!;
        expect(input.getAttribute("autocomplete")).toBe("one-time-code");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });

    test("maxlength and data-length follow length", () => {
        const input = render(BASE).querySelector("input")!;
        expect(input.getAttribute("maxlength")).toBe("6");
        expect(input.getAttribute("data-length")).toBe("6");
    });

    test("default pattern is digits, overridable", () => {
        expect(render(BASE).querySelector("input")!.getAttribute("pattern")).toBe("[0-9]*");
        const host = render(
            '<lily-one-time-password-input label="C" length="8" pattern="[A-Za-z0-9]*" inputmode="text"></lily-one-time-password-input>',
        );
        const input = host.querySelector("input")!;
        expect(input.getAttribute("pattern")).toBe("[A-Za-z0-9]*");
        expect(input.getAttribute("inputmode")).toBe("text");
    });

    test("disables spellcheck and autocapitalize", () => {
        const input = render(BASE).querySelector("input")!;
        expect(input.spellcheck).toBe(false);
        expect(input.getAttribute("autocapitalize")).toBe("off");
    });

    test("initial value is shown, and the value property proxies the input", () => {
        const host = render(
            '<lily-one-time-password-input label="C" length="6" value="123"></lily-one-time-password-input>',
        ) as unknown as OneTimePasswordInput;
        expect(host.querySelector("input")!.value).toBe("123");
        host.value = "456789";
        expect(host.querySelector("input")!.value).toBe("456789");
        expect(host.value).toBe("456789");
    });

    test("supports name, required and disabled", () => {
        const input = render(
            '<lily-one-time-password-input label="C" length="6" name="otp" required disabled></lily-one-time-password-input>',
        ).querySelector("input")!;
        expect(input.name).toBe("otp");
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through attributes and the consumer class", () => {
        const input = render(
            '<lily-one-time-password-input label="C" length="6" data-testid="x" class="extra"></lily-one-time-password-input>',
        ).querySelector("input")!;
        expect(input.getAttribute("data-testid")).toBe("x");
        expect(input.className).toBe("one-time-password-input extra");
    });
});
