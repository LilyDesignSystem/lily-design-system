import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedAmberGreenPickerButton } from "./RedAmberGreenPickerButton";

describe("RedAmberGreenPickerButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(RedAmberGreenPickerButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.red-amber-green-picker-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RedAmberGreenPickerButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.red-amber-green-picker-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
