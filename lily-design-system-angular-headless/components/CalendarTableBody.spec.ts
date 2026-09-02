import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableBody } from "./CalendarTableBody";

// CalendarTableBody is an attribute-selector component (`tbody[lily-calendar-table-body]`): its host is the
// native <tbody> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(CalendarTableBody)` directly (the
// latter has no <tbody> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [CalendarTableBody],
  template: `<tbody lily-calendar-table-body [className]="className"></tbody>`,
})
class TestHost {
  className = "";
}

describe("CalendarTableBody", () => {
  test("the host is the tbody itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody");
    expect(el.tagName).toBe("TBODY");
    expect(el.classList.contains("calendar-table-body")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
