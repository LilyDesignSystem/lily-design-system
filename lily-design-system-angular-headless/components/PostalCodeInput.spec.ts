import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PostalCodeInput } from "./PostalCodeInput";

describe("PostalCodeInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(PostalCodeInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.postal-code-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PostalCodeInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.postal-code-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
