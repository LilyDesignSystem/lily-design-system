import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CyprusNationalPassportNumberInput } from "./CyprusNationalPassportNumberInput";

describe("CyprusNationalPassportNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(CyprusNationalPassportNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.cyprus-national-passport-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CyprusNationalPassportNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.cyprus-national-passport-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
