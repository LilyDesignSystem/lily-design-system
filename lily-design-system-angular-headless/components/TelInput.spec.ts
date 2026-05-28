import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TelInput } from "./TelInput";

describe("TelInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(TelInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.tel-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TelInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.tel-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
