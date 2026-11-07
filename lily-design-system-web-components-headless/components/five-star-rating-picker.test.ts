import { afterEach, describe, expect, test } from "vitest";

import { FiveStarRatingPicker } from "./five-star-rating-picker.js";
import { FiveStarRatingPickerButton } from "./five-star-rating-picker-button.js";

if (!customElements.get("lily-five-star-rating-picker-button")) {
    customElements.define("lily-five-star-rating-picker-button", FiveStarRatingPickerButton);
}
if (!customElements.get("lily-five-star-rating-picker")) {
    customElements.define("lily-five-star-rating-picker", FiveStarRatingPicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveStarRatingPicker", () => {
    test("carries the base class", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>',
        );

        expect(host.classList.contains("five-star-rating-picker")).toBe(true);
    });

    test("has role=radiogroup", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>',
        );

        expect(host.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>',
        );

        expect(host.getAttribute("aria-label")).toBe("Rate this product");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rate this product" class="my-picker"></lily-five-star-rating-picker>',
        );

        expect(host.getAttribute("class")).toBe("five-star-rating-picker my-picker");
    });

    test("keeps consumer-supplied picker-button children in place", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rate this product"><button aria-pressed="false" aria-label="3 stars"></button></lily-five-star-rating-picker>',
        );

        expect(host.querySelector("button")).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>',
        );

        (host as unknown as FiveStarRatingPicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("Rate this product");
    });
});

describe("FiveStarRatingPicker keys", () => {
    test("is one radio group: one tab stop, and the arrows move, check and wrap", async () => {
        const host = render(
            '<lily-five-star-rating-picker label="Choice">' +
                '<lily-five-star-rating-picker-button value="1" label="One" selected></lily-five-star-rating-picker-button>' +
                '<lily-five-star-rating-picker-button value="2" label="Two"></lily-five-star-rating-picker-button>' +
                "</lily-five-star-rating-picker>",
        );
        await Promise.resolve();
        const [one, two] = host.querySelectorAll<HTMLButtonElement>("button");
        expect(one.getAttribute("role")).toBe("radio");
        expect([one.tabIndex, two.tabIndex]).toEqual([0, -1]);
        one.focus();
        one.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(two);
        expect(two.getAttribute("aria-checked")).toBe("true");
        expect(one.getAttribute("aria-checked")).toBe("false");
        two.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(one);
    });
});
