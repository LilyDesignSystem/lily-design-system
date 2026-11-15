import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { FiveStarRatingRadioGroup } from "./FiveStarRatingRadioGroup";

@Component({
    imports: [FiveStarRatingRadioGroup],
    template: `<lily-five-star-rating-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-five-star-rating-radio-group>`,
})
class Host0 {}

describe("FiveStarRatingRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".five-star-rating-radio-group")?.getAttribute("aria-label")).toBe(
            "Size",
        );
        expect(first.closest(".five-star-rating-radio-group")?.getAttribute("role")).toBe(
            "radiogroup",
        );
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
