import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { UnitedKingdomNationalHealthServiceNumberInput } from "./UnitedKingdomNationalHealthServiceNumberInput";

describe("UnitedKingdomNationalHealthServiceNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(UnitedKingdomNationalHealthServiceNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.united-kingdom-national-health-service-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(UnitedKingdomNationalHealthServiceNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.united-kingdom-national-health-service-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
