import { afterEach, describe, expect, test } from "vitest";

import { PakistanComputerizedNationalIdentityCardInput } from "./pakistan-computerized-national-identity-card-input.js";

if (!customElements.get("lily-pakistan-computerized-national-identity-card-input")) {
    customElements.define(
        "lily-pakistan-computerized-national-identity-card-input",
        PakistanComputerizedNationalIdentityCardInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PakistanComputerizedNationalIdentityCardInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-input label="Computerized National Identity Card Number (CNIC)"></lily-pakistan-computerized-national-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("pakistan-computerized-national-identity-card-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-input label="Computerized National Identity Card Number (CNIC)" autocomplete="on"></lily-pakistan-computerized-national-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-input label="Computerized National Identity Card Number (CNIC)" value="35202-1234567-1"></lily-pakistan-computerized-national-identity-card-input>',
        ) as unknown as PakistanComputerizedNationalIdentityCardInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("35202-1234567-1");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-input label="Computerized National Identity Card Number (CNIC)" required disabled></lily-pakistan-computerized-national-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-input label="Computerized National Identity Card Number (CNIC)"></lily-pakistan-computerized-national-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Computerized National Identity Card Number (CNIC)",
        );
    });
});
