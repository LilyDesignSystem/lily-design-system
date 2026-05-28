import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PasswordInputOrTextInputDiv } from "./PasswordInputOrTextInputDiv";

describe("PasswordInputOrTextInputDiv", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(PasswordInputOrTextInputDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.password-input-or-text-input-div");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PasswordInputOrTextInputDiv);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.password-input-or-text-input-div");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
