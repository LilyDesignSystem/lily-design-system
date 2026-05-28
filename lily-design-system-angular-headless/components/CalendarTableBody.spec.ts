import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableBody } from "./CalendarTableBody";

describe("CalendarTableBody", () => {
  test("renders the tbody root with the base class", () => {
    const fixture = TestBed.createComponent(CalendarTableBody);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody.calendar-table-body");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CalendarTableBody);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody.calendar-table-body");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
