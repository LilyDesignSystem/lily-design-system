import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ColorPickerButton } from "./ColorPickerButton";

describe("ColorPickerButton", () => {
    test("renders the button root with the base class", () => {
        const fixture = TestBed.createComponent(ColorPickerButton);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.color-picker-button");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ColorPickerButton);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.color-picker-button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("reflects colour, selected and disabled", () => {
        const fixture = TestBed.createComponent(ColorPickerButton);
        fixture.componentRef.setInput("color", "red");
        fixture.componentRef.setInput("selected", true);
        fixture.componentRef.setInput("disabled", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.getAttribute("data-color")).toBe("red");
        expect(el.style.backgroundColor).toBe("red");
        expect(el.getAttribute("aria-pressed")).toBe("true");
        expect(el.disabled).toBe(true);
    });
});
