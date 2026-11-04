import { afterEach, describe, expect, test } from "vitest";

import { IbanInput } from "./iban-input.js";

if (!customElements.get("lily-iban-input")) {
    customElements.define("lily-iban-input", IbanInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IbanInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-iban-input label="IBAN"></lily-iban-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("iban-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-iban-input label="IBAN" autocomplete="on"></lily-iban-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render(
            '<lily-iban-input label="IBAN" value="GB82WEST12345698765432"></lily-iban-input>',
        ) as unknown as IbanInput;

        expect(host.value).toBe("GB82WEST12345698765432");

        host.value = "DE89370400440532013000";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("DE89370400440532013000");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-iban-input label="IBAN" required disabled></lily-iban-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-iban-input label="IBAN"></lily-iban-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("IBAN");
    });
});
