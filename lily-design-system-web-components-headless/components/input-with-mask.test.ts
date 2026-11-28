import { afterEach, describe, expect, test } from "vitest";

import { InputWithMask } from "./input-with-mask.js";

if (!customElements.get("lily-input-with-mask")) {
    customElements.define("lily-input-with-mask", InputWithMask);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("InputWithMask", () => {
    test("renders as itself with the base class", () => {
        const host = render(
            '<lily-input-with-mask label="Phone number" mask="(___) ___-____"></lily-input-with-mask>',
        );

        expect(host.tagName.toLowerCase()).toBe("lily-input-with-mask");
        expect(host.className).toBe("input-with-mask");
    });

    test("exposes data-mask on the wrapper", () => {
        const host = render(
            '<lily-input-with-mask label="Phone number" mask="(___) ___-____"></lily-input-with-mask>',
        );

        expect(host.getAttribute("data-mask")).toBe("(___) ___-____");
    });

    test("renders the decorative mask display span", () => {
        const host = render(
            '<lily-input-with-mask label="Phone number" mask="(___) ___-____"></lily-input-with-mask>',
        );

        const display = host.querySelector(".input-with-mask-display")!;
        expect(display.getAttribute("aria-hidden")).toBe("true");
        expect(display.textContent).toBe("(___) ___-____");
    });

    test("renders the control input with type=text and aria-label", () => {
        const host = render(
            '<lily-input-with-mask label="Phone number" mask="(___) ___-____"></lily-input-with-mask>',
        );

        const input = host.querySelector("input.input-with-mask-control") as HTMLInputElement;
        expect(input).not.toBeNull();
        expect(input.type).toBe("text");
        expect(input.getAttribute("aria-label")).toBe("Phone number");
    });

    test("seeds the initial value and forwards placeholder/disabled", () => {
        const host = render(
            '<lily-input-with-mask label="Phone number" mask="(___) ___-____" value="555" placeholder="Enter phone" disabled></lily-input-with-mask>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.value).toBe("555");
        expect(input.placeholder).toBe("Enter phone");
        expect(input.disabled).toBe(true);
    });

    test("exposes a live value property that proxies to the inner input", () => {
        const host = render(
            '<lily-input-with-mask label="Phone number" mask="(___) ___-____" value="123"></lily-input-with-mask>',
        ) as unknown as InputWithMask;

        expect(host.value).toBe("123");
        host.value = "4567890123";
        expect(host.value).toBe("4567890123");
        expect(host.querySelector("input")!.value).toBe("4567890123");
    });
});

describe("InputWithMask follows its attributes (P50-T28)", () => {
    test("shows a change to mask, label, value, placeholder, disabled and class", () => {
        const host = render('<lily-input-with-mask mask="99" label="Old"></lily-input-with-mask>');
        host.setAttribute("mask", "999-999");
        host.setAttribute("label", "New");
        host.setAttribute("value", "123");
        host.setAttribute("placeholder", "000-000");
        host.setAttribute("disabled", "");
        host.setAttribute("class", "wide");
        const input = host.querySelector("input") as HTMLInputElement;
        expect(host.className).toBe("input-with-mask wide");
        expect(host.getAttribute("data-mask")).toBe("999-999");
        expect(host.querySelector(".input-with-mask-display")?.textContent).toBe("999-999");
        expect(input.getAttribute("aria-label")).toBe("New");
        expect(input.value).toBe("123");
        expect(input.placeholder).toBe("000-000");
        expect(input.disabled).toBe(true);
    });
});
