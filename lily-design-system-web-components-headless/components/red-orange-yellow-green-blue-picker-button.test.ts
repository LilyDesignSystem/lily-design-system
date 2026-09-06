import { afterEach, describe, expect, test } from "vitest";

import { RedOrangeYellowGreenBluePickerButton } from "./red-orange-yellow-green-blue-picker-button.js";

if (!customElements.get("lily-red-orange-yellow-green-blue-picker-button")) {
    customElements.define("lily-red-orange-yellow-green-blue-picker-button", RedOrangeYellowGreenBluePickerButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedOrangeYellowGreenBluePickerButton", () => {
    test("renders a native button with the label as visible text", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution"></lily-red-orange-yellow-green-blue-picker-button>',
        );

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.textContent).toBe("Yellow - Caution");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution"></lily-red-orange-yellow-green-blue-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Yellow - Caution");
    });

    test("exposes value via data-value", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution"></lily-red-orange-yellow-green-blue-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-value")).toBe("yellow");
    });

    test("defaults aria-pressed to false, and reflects selected", () => {
        const unselected = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution"></lily-red-orange-yellow-green-blue-picker-button>',
        );
        expect(unselected.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");

        const selected = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution" selected></lily-red-orange-yellow-green-blue-picker-button>',
        );
        expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });

    test("disabled propagates to the inner button", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution" disabled></lily-red-orange-yellow-green-blue-picker-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker-button value="yellow" label="Yellow - Caution" data-testid="roygb-yellow"></lily-red-orange-yellow-green-blue-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("roygb-yellow");
    });
});
