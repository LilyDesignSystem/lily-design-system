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
});
