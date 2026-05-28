import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MaltaPassportNumberInput } from "./MaltaPassportNumberInput";

describe("MaltaPassportNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(MaltaPassportNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.malta-passport-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MaltaPassportNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.malta-passport-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
