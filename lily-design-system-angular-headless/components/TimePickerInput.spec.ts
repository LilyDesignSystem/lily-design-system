import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TimePickerInput } from "./TimePickerInput";

describe("TimePickerInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(TimePickerInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.time-picker-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TimePickerInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.time-picker-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  // Guards the canonical type from components/{slug}/AGENTS.md — every
  // typed input in this library once rendered type="text" (fixed
  // 2026-08-26), and nothing asserted otherwise.
  test('renders the canonical input type "time"', () => {
    const fixture = TestBed.createComponent(TimePickerInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.time-picker-input");
    expect(el.getAttribute("type")).toBe("time");
  });
});
