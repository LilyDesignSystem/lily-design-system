import { afterEach, describe, expect, test } from "vitest";

import { FiveStarRatingPickerButton } from "./five-star-rating-picker-button.js";

if (!customElements.get("lily-five-star-rating-picker-button")) {
    customElements.define("lily-five-star-rating-picker-button", FiveStarRatingPickerButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveStarRatingPickerButton", () => {
    test("renders a native button with the label as visible text", () => {
        const host = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars"></lily-five-star-rating-picker-button>',
        );

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.textContent).toBe("3 stars");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars"></lily-five-star-rating-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("3 stars");
    });

    test("exposes value via data-value", () => {
        const host = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars"></lily-five-star-rating-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-value")).toBe("3");
    });

    test("defaults aria-pressed to false, and reflects selected", () => {
        const unselected = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars"></lily-five-star-rating-picker-button>',
        );
        expect(unselected.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");

        const selected = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars" selected></lily-five-star-rating-picker-button>',
        );
        expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    });

    test("disabled propagates to the inner button", () => {
        const host = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars" disabled></lily-five-star-rating-picker-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-five-star-rating-picker-button value="3" label="3 stars" data-testid="star-3"></lily-five-star-rating-picker-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-testid")).toBe("star-3");
    });
});
