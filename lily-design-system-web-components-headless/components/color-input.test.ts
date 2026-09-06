import { afterEach, describe, expect, test } from "vitest";

import { ColorInput } from "./color-input.js";

if (!customElements.get("lily-color-input")) {
    customElements.define("lily-color-input", ColorInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColorInput", () => {
    test("renders a native input type=color with the base class", () => {
        const host = render('<lily-color-input label="Accent colour"></lily-color-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("color");
        expect(input.classList.contains("color-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-color-input label="Accent colour"></lily-color-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Accent colour");
    });

    test("defaults value to #000000", () => {
        const host = render('<lily-color-input label="Accent colour"></lily-color-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("#000000");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-color-input label="Accent colour" value="#2563eb"></lily-color-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("#2563eb");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-color-input label="Accent colour"></lily-color-input>') as unknown as ColorInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "#16a34a";

        expect(input.value).toBe("#16a34a");
        expect(host.value).toBe("#16a34a");
    });

    test("disabled propagates to the inner input", () => {
        const host = render('<lily-color-input label="Accent colour" disabled></lily-color-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });
});
