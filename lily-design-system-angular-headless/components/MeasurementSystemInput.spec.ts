import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MeasurementSystemInput } from "./MeasurementSystemInput";

describe("MeasurementSystemInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(MeasurementSystemInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.measurement-system-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MeasurementSystemInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.measurement-system-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
