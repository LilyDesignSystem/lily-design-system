import { afterEach, describe, expect, test } from "vitest";

import { AddressInput } from "./address-input.js";

if (!customElements.get("lily-address-input")) {
    customElements.define("lily-address-input", AddressInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AddressInput", () => {
    test("renders a native input type=text with the base class", () => {
        const host = render('<lily-address-input label="Delivery address"></lily-address-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.classList.contains("address-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-address-input label="Delivery address"></lily-address-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Delivery address");
    });

    test("defaults autocomplete to street-address", () => {
        const host = render('<lily-address-input label="Delivery address"></lily-address-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("street-address");
    });

    test("autocomplete attribute overrides the default", () => {
        const host = render(
            '<lily-address-input label="Delivery address" autocomplete="address-line1"></lily-address-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("address-line1");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render(
            '<lily-address-input label="Delivery address" value="221B Baker Street"></lily-address-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("221B Baker Street");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-address-input label="Delivery address"></lily-address-input>') as unknown as AddressInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "10 Downing Street";

        expect(input.value).toBe("10 Downing Street");
        expect(host.value).toBe("10 Downing Street");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-address-input label="Delivery address" required disabled></lily-address-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});
