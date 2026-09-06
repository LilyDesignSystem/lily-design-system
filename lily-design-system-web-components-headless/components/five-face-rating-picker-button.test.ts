import { afterEach, describe, expect, test } from "vitest";

import { FiveFaceRatingPickerButton } from "./five-face-rating-picker-button.js";

if (!customElements.get("lily-five-face-rating-picker-button")) {
    customElements.define("lily-five-face-rating-picker-button", FiveFaceRatingPickerButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveFaceRatingPickerButton", () => {
    test("renders a native button with the label as visible text", () => {
        const host = render(
            '<lily-five-face-rating-picker-button value="4" label="Good"></lily-five-face-rating-picker-button>',
        );

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.textContent).toBe("Good");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-five-face-rating-picker-button value="4" label="Good"></lily-five-face-rating-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Good");
    });

    test("exposes value via data-value", () => {
        const host = render(
            '<lily-five-face-rating-picker-button value="4" label="Good"></lily-five-face-rating-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-value")).toBe("4");
    });

    test("defaults aria-pressed to false, and reflects selected", () => {
        const unselected = render(
            '<lily-five-face-rating-picker-button value="4" label="Good"></lily-five-face-rating-picker-button>',
        );
        expect(unselected.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");

        const selected = render(
            '<lily-five-face-rating-picker-button value="4" label="Good" selected></lily-five-face-rating-picker-button>',
        );
        expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });

    test("disabled propagates to the inner button", () => {
        const host = render(
            '<lily-five-face-rating-picker-button value="4" label="Good" disabled></lily-five-face-rating-picker-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-five-face-rating-picker-button value="4" label="Good" data-testid="face-4"></lily-five-face-rating-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("face-4");
    });
});
