import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(NumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.number-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NumberInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.number-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  // Guards the canonical type from components/{slug}/AGENTS.md — every
  // typed input in this library once rendered type="text" (fixed
  // 2026-08-26), and nothing asserted otherwise.
  test('renders the canonical input type "number"', () => {
    const fixture = TestBed.createComponent(NumberInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.number-input");
    expect(el.getAttribute("type")).toBe("number");
  });
});
