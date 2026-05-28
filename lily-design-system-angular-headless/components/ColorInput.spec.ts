import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ColorInput } from "./ColorInput";

describe("ColorInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(ColorInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.color-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ColorInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.color-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
