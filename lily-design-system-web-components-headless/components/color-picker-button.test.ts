import { afterEach, describe, expect, test } from "vitest";

import { ColorPickerButton } from "./color-picker-button.js";

if (!customElements.get("lily-color-picker-button")) {
    customElements.define("lily-color-picker-button", ColorPickerButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColorPickerButton", () => {
    test("renders a native button", () => {
        const host = render('<lily-color-picker-button color="#ff0000" label="Red"></lily-color-picker-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.classList.contains("color-picker-button")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-color-picker-button color="#ff0000" label="Red"></lily-color-picker-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Red");
    });

    test("exposes color via data-color rather than an inline style", () => {
        const host = render('<lily-color-picker-button color="#ff0000" label="Red"></lily-color-picker-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.getAttribute("data-color")).toBe("#ff0000");
        expect(button.getAttribute("style")).toBeNull();
    });

    test("defaults aria-pressed to false, and reflects selected", () => {
        const unselected = render('<lily-color-picker-button color="#ff0000" label="Red"></lily-color-picker-button>');
        expect(unselected.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");

        const selected = render(
            '<lily-color-picker-button color="#ff0000" label="Red" selected></lily-color-picker-button>',
        );
        expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });

    test("disabled propagates to the inner button", () => {
        const host = render(
            '<lily-color-picker-button color="#ff0000" label="Red" disabled></lily-color-picker-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-color-picker-button color="#ff0000" label="Red" class="swatch"></lily-color-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("class")).toBe("color-picker-button swatch");
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-color-picker-button color="#ff0000" label="Red" data-testid="swatch-1"></lily-color-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("swatch-1");
    });
});
