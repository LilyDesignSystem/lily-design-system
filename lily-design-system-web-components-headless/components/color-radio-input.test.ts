import { afterEach, describe, expect, test } from "vitest";

import { ColorRadioInput } from "./color-radio-input.js";

if (!customElements.get("lily-color-radio-input")) {
    customElements.define("lily-color-radio-input", ColorRadioInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColorRadioInput", () => {
    test("renders a native input type=radio", () => {
        const host = render('<lily-color-radio-input label="Email"></lily-color-radio-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("radio");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-color-radio-input label="Email"></lily-color-radio-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Email");
    });

    test("sets name and value for grouping", () => {
        const host = render(
            '<lily-color-radio-input label="Email" name="delivery" value="email"></lily-color-radio-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.name).toBe("delivery");
        expect(input.value).toBe("email");
    });

    test("checked and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-color-radio-input label="Email" checked disabled></lily-color-radio-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.checked).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("defaults to unchecked", () => {
        const host = render('<lily-color-radio-input label="Email"></lily-color-radio-input>');

        expect((host.querySelector("input") as HTMLInputElement).checked).toBe(false);
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render(
            '<lily-color-radio-input label="Email" class="my-extra"></lily-color-radio-input>',
        );

        expect(host.querySelector("input")!.className).toBe("color-radio-input my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render(
            '<lily-color-radio-input label="Email" id="delivery-email"></lily-color-radio-input>',
        );

        expect(host.querySelector("input")!.id).toBe("delivery-email");
    });

    test("exposes its colour in data-color and a custom property, and submits it by default", () => {
        const host = render(
            '<lily-color-radio-input color="#005eb8" label="Blue"></lily-color-radio-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("data-color")).toBe("#005eb8");
        expect(input.style.getPropertyValue("--color-radio-input-color")).toBe("#005eb8");
        expect(input.value).toBe("#005eb8");
    });
});
