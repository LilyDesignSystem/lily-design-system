import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableTbody } from "./GanttTableTbody";

describe("GanttTableTbody", () => {
  test("renders the tbody root with the base class", () => {
    const fixture = TestBed.createComponent(GanttTableTbody);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody.gantt-table-tbody");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GanttTableTbody);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody.gantt-table-tbody");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
