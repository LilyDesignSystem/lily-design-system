import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { CalendarDayTable } from "./CalendarDayTable";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(CalendarDayTable);
  fixture.componentRef.setInput("label", "Monday 6 January 2025");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const grid = (f: any): HTMLElement => f.nativeElement.querySelector("table");

@Component({
  standalone: true,
  imports: [CalendarDayTable],
  template: `<lily-calendar-day-table label="Monday 6 January 2025"><tbody><tr><td>15</td></tr></tbody></lily-calendar-day-table>`,
})
class Host {}

describe("CalendarDayTable", () => {
  test("renders a grid", () => {
    expect(grid(make()).getAttribute("role")).toBe("grid");
  });
  test("renders as a table element", () => {
    expect(grid(make()).tagName).toBe("TABLE");
  });
  test("has the calendar-day-table base class", () => {
    expect(grid(make()).classList.contains("calendar-day-table")).toBe(true);
  });
  test("keeps the base class and adds the consumer class", () => {
    const cls = grid(make({ className: "mine" })).classList;
    expect(cls.contains("calendar-day-table")).toBe(true);
    expect(cls.contains("mine")).toBe(true);
  });
  test("has aria-label from label", () => {
    expect(grid(make()).getAttribute("aria-label")).toBe("Monday 6 January 2025");
  });
  test("marks the view as data-view=day", () => {
    expect(grid(make()).getAttribute("data-view")).toBe("day");
  });
  test("renders caption when provided", () => {
    expect(grid(make({ caption: "Visible caption" })).querySelector("caption")?.textContent).toBe("Visible caption");
  });
  test("renders without caption by default", () => {
    expect(grid(make()).querySelector("caption")).toBeNull();
  });
  test("renders children content", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("table td")?.textContent).toBe("15");
  });
});
