import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MedicalBannerBoxForDanger } from "./MedicalBannerBoxForDanger";

describe("MedicalBannerBoxForDanger", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(MedicalBannerBoxForDanger);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.medical-banner-box-for-danger");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MedicalBannerBoxForDanger);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.medical-banner-box-for-danger");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
