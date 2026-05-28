import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MaltaNationalIdentificationNumberInput } from "./MaltaNationalIdentificationNumberInput";

describe("MaltaNationalIdentificationNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(MaltaNationalIdentificationNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.malta-national-identification-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MaltaNationalIdentificationNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.malta-national-identification-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
