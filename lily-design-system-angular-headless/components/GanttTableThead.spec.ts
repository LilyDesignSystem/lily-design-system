import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableThead } from "./GanttTableThead";

describe("GanttTableThead", () => {
  test("renders the thead root with the base class", () => {
    const fixture = TestBed.createComponent(GanttTableThead);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.gantt-table-thead");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GanttTableThead);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.gantt-table-thead");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
