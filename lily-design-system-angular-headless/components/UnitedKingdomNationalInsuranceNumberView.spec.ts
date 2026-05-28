import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { UnitedKingdomNationalInsuranceNumberView } from "./UnitedKingdomNationalInsuranceNumberView";

describe("UnitedKingdomNationalInsuranceNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(UnitedKingdomNationalInsuranceNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.united-kingdom-national-insurance-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(UnitedKingdomNationalInsuranceNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.united-kingdom-national-insurance-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
