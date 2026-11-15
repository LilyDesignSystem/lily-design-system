import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NetPromoterScoreRadioGroup } from "./NetPromoterScoreRadioGroup";

describe("NetPromoterScoreRadioGroup", () => {
    test("renders the fieldset root with the base class and role radiogroup", () => {
        const fixture = TestBed.createComponent(NetPromoterScoreRadioGroup);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.net-promoter-score-radio-group");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(NetPromoterScoreRadioGroup);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.net-promoter-score-radio-group");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
