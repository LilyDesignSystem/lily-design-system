import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateTimeNowInput } from "./DateTimeNowInput";

describe("DateTimeNowInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(DateTimeNowInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.date-time-now-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DateTimeNowInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.date-time-now-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
