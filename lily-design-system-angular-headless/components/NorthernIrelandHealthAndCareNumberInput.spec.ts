import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NorthernIrelandHealthAndCareNumberInput } from "./NorthernIrelandHealthAndCareNumberInput";

describe("NorthernIrelandHealthAndCareNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(NorthernIrelandHealthAndCareNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.northern-ireland-health-and-care-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NorthernIrelandHealthAndCareNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.northern-ireland-health-and-care-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
