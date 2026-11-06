import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedOrangeYellowGreenBluePickerButton } from "./RedOrangeYellowGreenBluePickerButton";

describe("RedOrangeYellowGreenBluePickerButton", () => {
    test("renders the button root with the base class", () => {
        const fixture = TestBed.createComponent(RedOrangeYellowGreenBluePickerButton);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "button.red-orange-yellow-green-blue-picker-button",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(RedOrangeYellowGreenBluePickerButton);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "button.red-orange-yellow-green-blue-picker-button",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("reflects value, selected, disabled and shows its label", () => {
        const fixture = TestBed.createComponent(RedOrangeYellowGreenBluePickerButton);
        fixture.componentRef.setInput("label", "Good");
        fixture.componentRef.setInput("value", "red");
        fixture.componentRef.setInput("selected", true);
        fixture.componentRef.setInput("disabled", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.getAttribute("data-value")).toBe("red");
        expect(el.getAttribute("aria-pressed")).toBe("true");
        expect(el.disabled).toBe(true);
        expect(el.textContent).toBe("Good");
    });
});
