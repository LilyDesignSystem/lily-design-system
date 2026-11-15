import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { FiveFaceRatingRadioGroup } from "./five-face-rating-radio-group.js";

if (!customElements.get("lily-five-face-rating-radio-group"))
    customElements.define("lily-five-face-rating-radio-group", FiveFaceRatingRadioGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("FiveFaceRatingRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML =
            '<lily-five-face-rating-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-five-face-rating-radio-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".five-face-rating-radio-group")?.getAttribute("aria-label")).toBe(
            "Size",
        );
        expect(first.closest(".five-face-rating-radio-group")?.getAttribute("role")).toBe(
            "radiogroup",
        );
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
