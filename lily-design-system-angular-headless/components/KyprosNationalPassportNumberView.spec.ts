import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { KyprosNationalPassportNumberView } from "./KyprosNationalPassportNumberView";

describe("KyprosNationalPassportNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(KyprosNationalPassportNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.kypros-national-passport-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(KyprosNationalPassportNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.kypros-national-passport-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
