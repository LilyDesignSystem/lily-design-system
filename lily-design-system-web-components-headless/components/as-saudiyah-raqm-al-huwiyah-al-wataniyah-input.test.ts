import { afterEach, describe, expect, test } from "vitest";

import { AsSaudiyahRaqmAlHuwiyahAlWataniyahInput } from "./as-saudiyah-raqm-al-huwiyah-al-wataniyah-input.js";

if (!customElements.get("lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input")) {
    customElements.define(
        "lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input",
        AsSaudiyahRaqmAlHuwiyahAlWataniyahInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input label="National Identification Number"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("as-saudiyah-raqm-al-huwiyah-al-wataniyah-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input label="National Identification Number" autocomplete="on"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input label="National Identification Number" value="1000000008"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input>',
        ) as unknown as AsSaudiyahRaqmAlHuwiyahAlWataniyahInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1000000008");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input label="National Identification Number" required disabled></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input label="National Identification Number"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National Identification Number",
        );
    });
});
