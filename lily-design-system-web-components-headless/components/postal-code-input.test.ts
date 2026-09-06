import { afterEach, describe, expect, test } from "vitest";

import { PostalCodeInput } from "./postal-code-input.js";

if (!customElements.get("lily-postal-code-input")) {
    customElements.define("lily-postal-code-input", PostalCodeInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PostalCodeInput", () => {
    test("renders a native input type=text", () => {
        const host = render('<lily-postal-code-input label="Postal code"></lily-postal-code-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("text");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-postal-code-input label="Postal code"></lily-postal-code-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Postal code");
    });

    test("sets autocomplete to postal-code", () => {
        const host = render('<lily-postal-code-input label="Postal code"></lily-postal-code-input>');

        expect((host.querySelector("input") as HTMLInputElement).autocomplete).toBe("postal-code");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-postal-code-input label="Postal code" value="SW1A 1AA"></lily-postal-code-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("SW1A 1AA");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-postal-code-input label="Postal code"></lily-postal-code-input>',
        ) as unknown as PostalCodeInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "90210";

        expect(input.value).toBe("90210");
        expect(host.value).toBe("90210");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-postal-code-input label="Postal code" required disabled></lily-postal-code-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});
