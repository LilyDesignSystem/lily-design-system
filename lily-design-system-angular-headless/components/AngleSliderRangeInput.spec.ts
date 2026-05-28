import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AngleSliderRangeInput } from "./AngleSliderRangeInput";

describe("AngleSliderRangeInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(AngleSliderRangeInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.angle-slider-range-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AngleSliderRangeInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.angle-slider-range-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
