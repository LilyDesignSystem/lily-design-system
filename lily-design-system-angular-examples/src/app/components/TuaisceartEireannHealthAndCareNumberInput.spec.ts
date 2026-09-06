import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TuaisceartEireannHealthAndCareNumberInput } from "./TuaisceartEireannHealthAndCareNumberInput";

describe("TuaisceartEireannHealthAndCareNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(TuaisceartEireannHealthAndCareNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.tuaisceart-eireann-health-and-care-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TuaisceartEireannHealthAndCareNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.tuaisceart-eireann-health-and-care-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
