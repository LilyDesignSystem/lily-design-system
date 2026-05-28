import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { UnitedStatesSocialSecurityNumberInput } from "./UnitedStatesSocialSecurityNumberInput";

describe("UnitedStatesSocialSecurityNumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(UnitedStatesSocialSecurityNumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.united-states-social-security-number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(UnitedStatesSocialSecurityNumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.united-states-social-security-number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
