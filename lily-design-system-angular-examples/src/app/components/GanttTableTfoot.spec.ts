import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableTfoot } from "./GanttTableTfoot";

describe("GanttTableTfoot", () => {
  test("renders the tfoot root with the base class", () => {
    const fixture = TestBed.createComponent(GanttTableTfoot);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot.gantt-table-tfoot");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GanttTableTfoot);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot.gantt-table-tfoot");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
