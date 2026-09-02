import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableTH } from "./CalendarTableTH";

// CalendarTableTH is an attribute-selector component (`th[lily-calendar-table-th]`): its host is the
// native <th> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(CalendarTableTH)` directly (the
// latter has no <th> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [CalendarTableTH],
  template: `<th lily-calendar-table-th [className]="className" [scope]="scope"></th>`,
})
class TestHost {
  className = "";
  scope = "";
}

describe("CalendarTableTH", () => {
  test("the host is the th itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("th");
    expect(el.tagName).toBe("TH");
    expect(el.classList.contains("calendar-table-th")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("th");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
