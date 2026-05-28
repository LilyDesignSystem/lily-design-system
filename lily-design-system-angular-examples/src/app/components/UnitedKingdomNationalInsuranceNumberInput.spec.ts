import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { UnitedKingdomNationalInsuranceNumberInput } from "./UnitedKingdomNationalInsuranceNumberInput";

describe("UnitedKingdomNationalInsuranceNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(UnitedKingdomNationalInsuranceNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.united-kingdom-national-insurance-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(UnitedKingdomNationalInsuranceNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.united-kingdom-national-insurance-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
