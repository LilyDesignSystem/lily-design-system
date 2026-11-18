import { afterEach, describe, expect, test } from "vitest";

import { HongKongIdentityCardInput } from "./hong-kong-identity-card-input.js";

if (!customElements.get("lily-hong-kong-identity-card-input")) {
    customElements.define("lily-hong-kong-identity-card-input", HongKongIdentityCardInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HongKongIdentityCardInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-hong-kong-identity-card-input label="Hong Kong Identity Card Number"></lily-hong-kong-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("hong-kong-identity-card-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-hong-kong-identity-card-input label="Hong Kong Identity Card Number" autocomplete="on"></lily-hong-kong-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-hong-kong-identity-card-input label="Hong Kong Identity Card Number" value="A123456(3)"></lily-hong-kong-identity-card-input>',
        ) as unknown as HongKongIdentityCardInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("A123456(3)");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-hong-kong-identity-card-input label="Hong Kong Identity Card Number" required disabled></lily-hong-kong-identity-card-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-hong-kong-identity-card-input label="Hong Kong Identity Card Number"></lily-hong-kong-identity-card-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Hong Kong Identity Card Number",
        );
    });
});
