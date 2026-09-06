import { afterEach, describe, expect, test } from "vitest";

import { RedAmberGreenPicker } from "./red-amber-green-picker.js";

if (!customElements.get("lily-red-amber-green-picker")) {
    customElements.define("lily-red-amber-green-picker", RedAmberGreenPicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedAmberGreenPicker", () => {
    test("carries the base class", () => {
        const host = render('<lily-red-amber-green-picker label="Project status"></lily-red-amber-green-picker>');

        expect(host.classList.contains("red-amber-green-picker")).toBe(true);
    });

    test("has role=radiogroup, not a native select", () => {
        const host = render('<lily-red-amber-green-picker label="Project status"></lily-red-amber-green-picker>');

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.querySelector("select")).toBeNull();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-red-amber-green-picker label="Project status"></lily-red-amber-green-picker>');

        expect(host.getAttribute("aria-label")).toBe("Project status");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-red-amber-green-picker label="Project status" class="my-picker"></lily-red-amber-green-picker>',
        );

        expect(host.getAttribute("class")).toBe("red-amber-green-picker my-picker");
    });

    test("keeps consumer-supplied picker-button children in place", () => {
        const host = render(
            '<lily-red-amber-green-picker label="Project status"><button aria-pressed="false" aria-label="Green" data-value="green"></button></lily-red-amber-green-picker>',
        );

        expect(host.querySelector('button[data-value="green"]')).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render('<lily-red-amber-green-picker label="Project status"></lily-red-amber-green-picker>');

        (host as unknown as RedAmberGreenPicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("Project status");
    });
});
