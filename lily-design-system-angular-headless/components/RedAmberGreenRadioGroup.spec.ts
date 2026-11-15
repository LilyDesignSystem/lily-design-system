import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedAmberGreenRadioGroup } from "./RedAmberGreenRadioGroup";

describe("RedAmberGreenRadioGroup", () => {
    test("renders the fieldset root with the base class and role radiogroup", () => {
        const fixture = TestBed.createComponent(RedAmberGreenRadioGroup);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.red-amber-green-radio-group");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(RedAmberGreenRadioGroup);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.red-amber-green-radio-group");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
