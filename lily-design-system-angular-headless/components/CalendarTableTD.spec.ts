import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableTD } from "./CalendarTableTD";

describe("CalendarTableTD", () => {
  test("renders the td root with the base class", () => {
    const fixture = TestBed.createComponent(CalendarTableTD);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.calendar-table-td");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CalendarTableTD);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.calendar-table-td");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
