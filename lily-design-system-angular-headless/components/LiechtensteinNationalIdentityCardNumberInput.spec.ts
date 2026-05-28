import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LiechtensteinNationalIdentityCardNumberInput } from "./LiechtensteinNationalIdentityCardNumberInput";

describe("LiechtensteinNationalIdentityCardNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(LiechtensteinNationalIdentityCardNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.liechtenstein-national-identity-card-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LiechtensteinNationalIdentityCardNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.liechtenstein-national-identity-card-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
