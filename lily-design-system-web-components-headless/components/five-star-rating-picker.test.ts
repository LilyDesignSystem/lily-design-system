import { afterEach, describe, expect, test } from "vitest";

import { FiveStarRatingPicker } from "./five-star-rating-picker.js";

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
        const host = render('<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>');

        expect(host.classList.contains("five-star-rating-picker")).toBe(true);
    });

    test("has role=radiogroup", () => {
        const host = render('<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>');

        expect(host.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>');

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
        const host = render('<lily-five-star-rating-picker label="Rate this product"></lily-five-star-rating-picker>');

        (host as unknown as FiveStarRatingPicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("Rate this product");
    });
});
