import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GanttTableTfoot } from "./GanttTableTfoot";

// GanttTableTfoot is an attribute-selector component (`tfoot[lily-gantt-table-tfoot]`): its host is the
// native <tfoot> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(GanttTableTfoot)` directly (the
// latter has no <tfoot> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [GanttTableTfoot],
  template: `<tfoot lily-gantt-table-tfoot [className]="className"></tfoot>`,
})
class TestHost {
  className = "";
}

describe("GanttTableTfoot", () => {
  test("the host is the tfoot itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot");
    expect(el.tagName).toBe("TFOOT");
    expect(el.classList.contains("gantt-table-tfoot")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tfoot");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
