import { afterEach, describe, expect, test } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { FiveStarRatingPicker } from "./five-star-rating-picker.js";

if (!customElements.get("lily-five-star-rating-picker"))
    customElements.define("lily-five-star-rating-picker", FiveStarRatingPicker);

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}
const radios = () => Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
const texts = () =>
    Array.from(document.querySelectorAll("label")).map((l) => l.textContent!.trim());

describe("FiveStarRatingPicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rating" class="extra"></lily-five-star-rating-picker>',
        );
        const root = host.querySelector("fieldset.five-star-rating-picker")!;
        expect(root.getAttribute("role")).toBe("radiogroup");
        expect(root.getAttribute("aria-label")).toBe("Rating");
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds 5 native radios, sharing one name", () => {
        render('<lily-five-star-rating-picker label="Rating"></lily-five-star-rating-picker>');
        expect(radios().map((r) => r.value)).toEqual(["1", "2", "3", "4", "5"]);
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["rating"]));
    });

    test("the label-N attributes give each option its text; without them, the numbers alone", () => {
        render(
            '<lily-five-star-rating-picker label="Rating" label-1="Très mauvais" label-2="Mauvais" label-3="Moyen" label-4="Bon" label-5="Très bon"></lily-five-star-rating-picker>',
        );
        expect(texts()).toEqual(["Très mauvais", "Mauvais", "Moyen", "Bon", "Très bon"]);
        render('<lily-five-star-rating-picker label="Rating"></lily-five-star-rating-picker>');
        expect(texts()).toEqual(["1", "2", "3", "4", "5"]);
    });

    test("checks the radio for value, and a choice updates value", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rating" value="3"></lily-five-star-rating-picker>',
        );
        expect(radios().map((r) => r.checked)).toEqual([false, false, true, false, false]);
        radios()[0].click();
        expect(host.getAttribute("value")).toBe("1");
    });

    test("ArrowRight moves the selection through the native radio group", async () => {
        const user = userEvent.setup();
        render('<lily-five-star-rating-picker label="Rating"></lily-five-star-rating-picker>');
        await user.click(radios()[0]);
        await user.keyboard("{ArrowRight}");
        expect(radios()[1].checked).toBe(true);
    });

    test("disabled disables the group", () => {
        const host = render(
            '<lily-five-star-rating-picker label="Rating" disabled></lily-five-star-rating-picker>',
        );
        expect(host.querySelector("fieldset")!.disabled).toBe(true);
    });
});
