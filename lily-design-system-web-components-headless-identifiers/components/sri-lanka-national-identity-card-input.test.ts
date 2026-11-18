import { afterEach, describe, expect, test } from "vitest";

import { SriLankaNationalIdentityCardInput } from "./sri-lanka-national-identity-card-input.js";

if (!customElements.get("lily-sri-lanka-national-identity-card-input")) {
    customElements.define(
        "lily-sri-lanka-national-identity-card-input",
        SriLankaNationalIdentityCardInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SriLankaNationalIdentityCardInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-input label="National Identity Card (NIC) number"></lily-sri-lanka-national-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("sri-lanka-national-identity-card-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-input label="National Identity Card (NIC) number" autocomplete="on"></lily-sri-lanka-national-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-input label="National Identity Card (NIC) number" value="197419202757"></lily-sri-lanka-national-identity-card-input>',
        ) as unknown as SriLankaNationalIdentityCardInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("197419202757");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-input label="National Identity Card (NIC) number" required disabled></lily-sri-lanka-national-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-input label="National Identity Card (NIC) number"></lily-sri-lanka-national-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National Identity Card (NIC) number",
        );
    });
});
