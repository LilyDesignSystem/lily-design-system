import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NorthernIrelandHealthAndCareNumberView } from "./NorthernIrelandHealthAndCareNumberView";

describe("NorthernIrelandHealthAndCareNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(NorthernIrelandHealthAndCareNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.northern-ireland-health-and-care-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NorthernIrelandHealthAndCareNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.northern-ireland-health-and-care-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
