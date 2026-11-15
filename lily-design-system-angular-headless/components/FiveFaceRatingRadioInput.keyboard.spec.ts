import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { FiveFaceRatingRadioInput } from "./FiveFaceRatingRadioInput";

@Component({
    imports: [FiveFaceRatingRadioInput],
    template: `<lily-five-face-rating-radio-input label="Yes" name="choice"></lily-five-face-rating-radio-input>`,
})
class Host0 {}

@Component({
    imports: [FiveFaceRatingRadioInput],
    template: `<lily-five-face-rating-radio-input label="Yes" name="choice" [disabled]="true"></lily-five-face-rating-radio-input>`,
})
class Host1 {}

describe("FiveFaceRatingRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.five-face-rating-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
