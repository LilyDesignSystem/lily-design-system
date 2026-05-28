import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MaltaPassportNumberView } from "./MaltaPassportNumberView";

describe("MaltaPassportNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(MaltaPassportNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.malta-passport-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MaltaPassportNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.malta-passport-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
