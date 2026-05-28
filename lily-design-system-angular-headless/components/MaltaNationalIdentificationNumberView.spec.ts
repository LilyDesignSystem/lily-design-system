import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MaltaNationalIdentificationNumberView } from "./MaltaNationalIdentificationNumberView";

describe("MaltaNationalIdentificationNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(MaltaNationalIdentificationNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.malta-national-identification-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MaltaNationalIdentificationNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.malta-national-identification-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
