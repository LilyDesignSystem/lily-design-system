import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { FiveStarRatingRadioInput } from "./five-star-rating-radio-input.js";

if (!customElements.get("lily-five-star-rating-radio-input"))
    customElements.define("lily-five-star-rating-radio-input", FiveStarRatingRadioInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("FiveStarRatingRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        document.body.innerHTML =
            '<lily-five-star-rating-radio-input label="Yes" name="choice"></lily-five-star-rating-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.five-star-rating-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-five-star-rating-radio-input label="Yes" name="choice" disabled></lily-five-star-rating-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
