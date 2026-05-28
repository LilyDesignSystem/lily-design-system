import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableTD } from "./GanttTableTD";

describe("GanttTableTD", () => {
  test("renders the td root with the base class", () => {
    const fixture = TestBed.createComponent(GanttTableTD);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.gantt-table-td");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GanttTableTD);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.gantt-table-td");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
