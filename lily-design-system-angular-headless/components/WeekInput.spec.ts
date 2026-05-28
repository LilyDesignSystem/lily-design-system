import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { WeekInput } from "./WeekInput";

describe("WeekInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(WeekInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.week-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(WeekInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.week-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
