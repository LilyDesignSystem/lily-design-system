import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RangeInput } from "./RangeInput";

describe("RangeInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(RangeInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.range-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RangeInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.range-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
