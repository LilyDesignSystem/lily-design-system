import { afterEach, describe, expect, test } from "vitest";

import { BangladeshNationalIdentityCardInput } from "./bangladesh-national-identity-card-input.js";

if (!customElements.get("lily-bangladesh-national-identity-card-input")) {
    customElements.define(
        "lily-bangladesh-national-identity-card-input",
        BangladeshNationalIdentityCardInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BangladeshNationalIdentityCardInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-input label="National ID (NID) number"></lily-bangladesh-national-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("bangladesh-national-identity-card-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-input label="National ID (NID) number" autocomplete="on"></lily-bangladesh-national-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-input label="National ID (NID) number" value="1234567890"></lily-bangladesh-national-identity-card-input>',
        ) as unknown as BangladeshNationalIdentityCardInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1234567890");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-input label="National ID (NID) number" required disabled></lily-bangladesh-national-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-input label="National ID (NID) number"></lily-bangladesh-national-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National ID (NID) number",
        );
    });
});
