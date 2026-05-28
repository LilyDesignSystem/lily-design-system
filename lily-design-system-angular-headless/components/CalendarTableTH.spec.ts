import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableTH } from "./CalendarTableTH";

describe("CalendarTableTH", () => {
  test("renders the th root with the base class", () => {
    const fixture = TestBed.createComponent(CalendarTableTH);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("th.calendar-table-th");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CalendarTableTH);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("th.calendar-table-th");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
