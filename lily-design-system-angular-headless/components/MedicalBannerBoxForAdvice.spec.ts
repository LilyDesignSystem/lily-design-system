import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MedicalBannerBoxForAdvice } from "./MedicalBannerBoxForAdvice";

describe("MedicalBannerBoxForAdvice", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(MedicalBannerBoxForAdvice);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.medical-banner-box-for-advice");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MedicalBannerBoxForAdvice);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.medical-banner-box-for-advice");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
