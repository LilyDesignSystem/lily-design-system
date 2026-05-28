import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateRange } from "./DateRange";

describe("DateRange", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(DateRange);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.date-range");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DateRange);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.date-range");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
