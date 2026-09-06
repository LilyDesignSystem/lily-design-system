import { afterEach, describe, expect, test } from "vitest";

import { RedOrangeYellowGreenBluePicker } from "./red-orange-yellow-green-blue-picker.js";

if (!customElements.get("lily-red-orange-yellow-green-blue-picker")) {
    customElements.define("lily-red-orange-yellow-green-blue-picker", RedOrangeYellowGreenBluePicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedOrangeYellowGreenBluePicker", () => {
    test("carries the base class", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Sprint status"></lily-red-orange-yellow-green-blue-picker>',
        );

        expect(host.classList.contains("red-orange-yellow-green-blue-picker")).toBe(true);
    });

    test("has role=radiogroup, not a native select", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Sprint status"></lily-red-orange-yellow-green-blue-picker>',
        );

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.querySelector("select")).toBeNull();
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Sprint status"></lily-red-orange-yellow-green-blue-picker>',
        );

        expect(host.getAttribute("aria-label")).toBe("Sprint status");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Sprint status" class="my-picker"></lily-red-orange-yellow-green-blue-picker>',
        );

        expect(host.getAttribute("class")).toBe("red-orange-yellow-green-blue-picker my-picker");
    });

    test("keeps consumer-supplied picker-button children in place", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Sprint status"><button aria-pressed="false" aria-label="Green" data-value="green"></button></lily-red-orange-yellow-green-blue-picker>',
        );

        expect(host.querySelector('button[data-value="green"]')).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Sprint status"></lily-red-orange-yellow-green-blue-picker>',
        );

        (host as unknown as RedOrangeYellowGreenBluePicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("Sprint status");
    });
});
