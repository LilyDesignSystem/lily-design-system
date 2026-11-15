import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ColorRadioGroup } from "./ColorRadioGroup";

describe("ColorRadioGroup", () => {
    test("renders the fieldset root with the base class and role radiogroup", () => {
        const fixture = TestBed.createComponent(ColorRadioGroup);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.color-radio-group");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ColorRadioGroup);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.color-radio-group");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
