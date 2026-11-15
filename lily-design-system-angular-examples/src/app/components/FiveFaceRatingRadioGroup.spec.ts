import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveFaceRatingRadioGroup } from "./FiveFaceRatingRadioGroup";

describe("FiveFaceRatingRadioGroup", () => {
    test("renders the fieldset root with the base class and role radiogroup", () => {
        const fixture = TestBed.createComponent(FiveFaceRatingRadioGroup);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.five-face-rating-radio-group");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FiveFaceRatingRadioGroup);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.five-face-rating-radio-group");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
