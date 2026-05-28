import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(PasswordInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.password-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PasswordInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.password-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
