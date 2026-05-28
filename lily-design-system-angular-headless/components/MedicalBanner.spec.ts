import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MedicalBanner } from "./MedicalBanner";

describe("MedicalBanner", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(MedicalBanner);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.medical-banner");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MedicalBanner);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.medical-banner");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
