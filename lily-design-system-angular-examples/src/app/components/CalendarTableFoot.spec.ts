import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableFoot } from "./CalendarTableFoot";

describe("CalendarTableFoot", () => {
  test("renders the tfoot root with the base class", () => {
    const fixture = TestBed.createComponent(CalendarTableFoot);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot.calendar-table-foot");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CalendarTableFoot);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot.calendar-table-foot");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
