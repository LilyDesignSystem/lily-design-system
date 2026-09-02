import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableTr } from "./GanttTableTr";

// GanttTableTr is an attribute-selector component (`tr[lily-gantt-table-tr]`): its host is the
// native <tr> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(GanttTableTr)` directly (the
// latter has no <tr> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [GanttTableTr],
  template: `<tr lily-gantt-table-tr [className]="className"></tr>`,
})
class TestHost {
  className = "";
}

describe("GanttTableTr", () => {
  test("the host is the tr itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr");
    expect(el.tagName).toBe("TR");
    expect(el.classList.contains("gantt-table-tr")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
