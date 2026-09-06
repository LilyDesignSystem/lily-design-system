import { afterEach, describe, expect, test } from "vitest";

import { FiveFaceRatingPicker } from "./five-face-rating-picker.js";

if (!customElements.get("lily-five-face-rating-picker")) {
    customElements.define("lily-five-face-rating-picker", FiveFaceRatingPicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveFaceRatingPicker", () => {
    test("carries the base class", () => {
        const host = render('<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>');

        expect(host.classList.contains("five-face-rating-picker")).toBe(true);
    });

    test("has role=radiogroup", () => {
        const host = render('<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>');

        expect(host.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>');

        expect(host.getAttribute("aria-label")).toBe("Rate your visit");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-five-face-rating-picker label="Rate your visit" class="my-picker"></lily-five-face-rating-picker>',
        );

        expect(host.getAttribute("class")).toBe("five-face-rating-picker my-picker");
    });

    test("keeps consumer-supplied picker-button children in place", () => {
        const host = render(
            '<lily-five-face-rating-picker label="Rate your visit"><button aria-pressed="false" aria-label="Very bad"></button></lily-five-face-rating-picker>',
        );

        expect(host.querySelector("button")).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render('<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>');

        (host as unknown as FiveFaceRatingPicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("Rate your visit");
    });
});
