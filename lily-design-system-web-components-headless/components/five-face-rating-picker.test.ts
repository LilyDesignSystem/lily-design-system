import { afterEach, describe, expect, test } from "vitest";

import { FiveFaceRatingPicker } from "./five-face-rating-picker.js";
import { FiveFaceRatingPickerButton } from "./five-face-rating-picker-button.js";

if (!customElements.get("lily-five-face-rating-picker-button")) {
    customElements.define("lily-five-face-rating-picker-button", FiveFaceRatingPickerButton);
}
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
        const host = render(
            '<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>',
        );

        expect(host.classList.contains("five-face-rating-picker")).toBe(true);
    });

    test("has role=radiogroup", () => {
        const host = render(
            '<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>',
        );

        expect(host.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>',
        );

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
        const host = render(
            '<lily-five-face-rating-picker label="Rate your visit"></lily-five-face-rating-picker>',
        );

        (host as unknown as FiveFaceRatingPicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("Rate your visit");
    });
});

describe("FiveFaceRatingPicker keys", () => {
    test("is one radio group: one tab stop, and the arrows move, check and wrap", async () => {
        const host = render(
            '<lily-five-face-rating-picker label="Choice">' +
                '<lily-five-face-rating-picker-button value="1" label="One" selected></lily-five-face-rating-picker-button>' +
                '<lily-five-face-rating-picker-button value="2" label="Two"></lily-five-face-rating-picker-button>' +
                "</lily-five-face-rating-picker>",
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
