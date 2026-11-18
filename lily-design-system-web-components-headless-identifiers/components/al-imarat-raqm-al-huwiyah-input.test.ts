import { afterEach, describe, expect, test } from "vitest";

import { AlImaratRaqmAlHuwiyahInput } from "./al-imarat-raqm-al-huwiyah-input.js";

if (!customElements.get("lily-al-imarat-raqm-al-huwiyah-input")) {
    customElements.define("lily-al-imarat-raqm-al-huwiyah-input", AlImaratRaqmAlHuwiyahInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AlImaratRaqmAlHuwiyahInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-input label="Emirates ID number"></lily-al-imarat-raqm-al-huwiyah-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("al-imarat-raqm-al-huwiyah-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-input label="Emirates ID number" autocomplete="on"></lily-al-imarat-raqm-al-huwiyah-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-input label="Emirates ID number" value="784-1985-1234567-1"></lily-al-imarat-raqm-al-huwiyah-input>',
        ) as unknown as AlImaratRaqmAlHuwiyahInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("784-1985-1234567-1");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-input label="Emirates ID number" required disabled></lily-al-imarat-raqm-al-huwiyah-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-input label="Emirates ID number"></lily-al-imarat-raqm-al-huwiyah-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Emirates ID number");
    });
});
