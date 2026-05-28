import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableHead } from "./CalendarTableHead";

describe("CalendarTableHead", () => {
  test("renders the thead root with the base class", () => {
    const fixture = TestBed.createComponent(CalendarTableHead);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.calendar-table-head");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CalendarTableHead);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.calendar-table-head");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
