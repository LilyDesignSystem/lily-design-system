import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LiechtensteinPassportNumberInput } from "./LiechtensteinPassportNumberInput";

describe("LiechtensteinPassportNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(LiechtensteinPassportNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.liechtenstein-passport-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LiechtensteinPassportNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.liechtenstein-passport-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
