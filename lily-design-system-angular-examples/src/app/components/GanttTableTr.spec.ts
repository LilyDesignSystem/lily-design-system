import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableTr } from "./GanttTableTr";

describe("GanttTableTr", () => {
  test("renders the tr root with the base class", () => {
    const fixture = TestBed.createComponent(GanttTableTr);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr.gantt-table-tr");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GanttTableTr);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr.gantt-table-tr");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
