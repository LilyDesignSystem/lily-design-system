import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EnglandNationalHealthServiceNumberInput } from "./EnglandNationalHealthServiceNumberInput";

describe("EnglandNationalHealthServiceNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(EnglandNationalHealthServiceNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.england-national-health-service-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EnglandNationalHealthServiceNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.england-national-health-service-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
