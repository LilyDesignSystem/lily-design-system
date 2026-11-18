import { afterEach, describe, expect, test } from "vitest";

import { MauritiusNationalIdentityCardNumberInput } from "./mauritius-national-identity-card-number-input.js";

if (!customElements.get("lily-mauritius-national-identity-card-number-input")) {
    customElements.define(
        "lily-mauritius-national-identity-card-number-input",
        MauritiusNationalIdentityCardNumberInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MauritiusNationalIdentityCardNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-input label="National Identity Card number"></lily-mauritius-national-identity-card-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("mauritius-national-identity-card-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-input label="National Identity Card number" autocomplete="on"></lily-mauritius-national-identity-card-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-input label="National Identity Card number" value="A0101801234567"></lily-mauritius-national-identity-card-number-input>',
        ) as unknown as MauritiusNationalIdentityCardNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("A0101801234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-input label="National Identity Card number" required disabled></lily-mauritius-national-identity-card-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-input label="National Identity Card number"></lily-mauritius-national-identity-card-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National Identity Card number",
        );
    });
});
