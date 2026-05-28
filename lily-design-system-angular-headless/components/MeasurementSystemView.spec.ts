import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MeasurementSystemView } from "./MeasurementSystemView";

describe("MeasurementSystemView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(MeasurementSystemView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.measurement-system-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MeasurementSystemView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.measurement-system-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
