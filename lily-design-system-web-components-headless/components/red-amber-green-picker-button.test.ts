import { afterEach, describe, expect, test } from "vitest";

import { RedAmberGreenPickerButton } from "./red-amber-green-picker-button.js";

if (!customElements.get("lily-red-amber-green-picker-button")) {
    customElements.define("lily-red-amber-green-picker-button", RedAmberGreenPickerButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedAmberGreenPickerButton", () => {
    test("renders a native button with the label as visible text", () => {
        const host = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution"></lily-red-amber-green-picker-button>',
        );

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.textContent).toBe("Amber - Caution");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution"></lily-red-amber-green-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Amber - Caution");
    });

    test("exposes value via data-value", () => {
        const host = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution"></lily-red-amber-green-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-value")).toBe("amber");
    });

    test("defaults aria-pressed to false, and reflects selected", () => {
        const unselected = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution"></lily-red-amber-green-picker-button>',
        );
        expect(unselected.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");

        const selected = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution" selected></lily-red-amber-green-picker-button>',
        );
        expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });

    test("disabled propagates to the inner button", () => {
        const host = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution" disabled></lily-red-amber-green-picker-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-red-amber-green-picker-button value="amber" label="Amber - Caution" data-testid="rag-amber"></lily-red-amber-green-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("rag-amber");
    });
});
