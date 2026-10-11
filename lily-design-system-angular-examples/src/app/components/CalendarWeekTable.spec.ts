import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { CalendarWeekTable } from "./CalendarWeekTable";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(CalendarWeekTable);
  fixture.componentRef.setInput("label", "Week of 6 January 2025");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}
const grid = (f: any): HTMLElement => f.nativeElement.querySelector("table");

@Component({
  standalone: true,
  imports: [CalendarWeekTable],
  template: `<lily-calendar-week-table label="Week of 6 January 2025"><tbody><tr><td>15</td></tr></tbody></lily-calendar-week-table>`,
})
class Host {}

describe("CalendarWeekTable", () => {
  test("renders a grid", () => {
    expect(grid(make()).getAttribute("role")).toBe("grid");
  });
  test("renders as a table element", () => {
    expect(grid(make()).tagName).toBe("TABLE");
  });
  test("has the calendar-week-table base class", () => {
    expect(grid(make()).classList.contains("calendar-week-table")).toBe(true);
  });
  test("keeps the base class and adds the consumer class", () => {
    const cls = grid(make({ className: "mine" })).classList;
    expect(cls.contains("calendar-week-table")).toBe(true);
    expect(cls.contains("mine")).toBe(true);
  });
  test("has aria-label from label", () => {
    expect(grid(make()).getAttribute("aria-label")).toBe("Week of 6 January 2025");
  });
  test("marks the view as data-view=week", () => {
    expect(grid(make()).getAttribute("data-view")).toBe("week");
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
