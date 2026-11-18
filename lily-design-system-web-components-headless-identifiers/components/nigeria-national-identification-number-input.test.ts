import { afterEach, describe, expect, test } from "vitest";

import { NigeriaNationalIdentificationNumberInput } from "./nigeria-national-identification-number-input.js";

if (!customElements.get("lily-nigeria-national-identification-number-input")) {
    customElements.define(
        "lily-nigeria-national-identification-number-input",
        NigeriaNationalIdentificationNumberInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NigeriaNationalIdentificationNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-input label="National Identification Number (NIN)"></lily-nigeria-national-identification-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("nigeria-national-identification-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-input label="National Identification Number (NIN)" autocomplete="on"></lily-nigeria-national-identification-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-input label="National Identification Number (NIN)" value="12345678901"></lily-nigeria-national-identification-number-input>',
        ) as unknown as NigeriaNationalIdentificationNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("12345678901");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-input label="National Identification Number (NIN)" required disabled></lily-nigeria-national-identification-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-input label="National Identification Number (NIN)"></lily-nigeria-national-identification-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National Identification Number (NIN)",
        );
    });
});
