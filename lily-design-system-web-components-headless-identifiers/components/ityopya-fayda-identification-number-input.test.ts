import { afterEach, describe, expect, test } from "vitest";

import { ItyopyaFaydaIdentificationNumberInput } from "./ityopya-fayda-identification-number-input.js";

if (!customElements.get("lily-ityopya-fayda-identification-number-input")) {
    customElements.define(
        "lily-ityopya-fayda-identification-number-input",
        ItyopyaFaydaIdentificationNumberInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ItyopyaFaydaIdentificationNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-input label="Fayda Identification Number (FIN)"></lily-ityopya-fayda-identification-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("ityopya-fayda-identification-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-input label="Fayda Identification Number (FIN)" autocomplete="on"></lily-ityopya-fayda-identification-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-input label="Fayda Identification Number (FIN)" value="123456789012"></lily-ityopya-fayda-identification-number-input>',
        ) as unknown as ItyopyaFaydaIdentificationNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123456789012");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-input label="Fayda Identification Number (FIN)" required disabled></lily-ityopya-fayda-identification-number-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-input label="Fayda Identification Number (FIN)"></lily-ityopya-fayda-identification-number-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Fayda Identification Number (FIN)",
        );
    });
});
