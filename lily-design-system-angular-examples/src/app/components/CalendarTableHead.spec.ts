import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableHead } from "./CalendarTableHead";

// CalendarTableHead is an attribute-selector component (`thead[lily-calendar-table-head]`): its host is the
// native <thead> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(CalendarTableHead)` directly (the
// latter has no <thead> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [CalendarTableHead],
  template: `<thead lily-calendar-table-head [className]="className"></thead>`,
})
class TestHost {
  className = "";
}

describe("CalendarTableHead", () => {
  test("the host is the thead itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead");
    expect(el.tagName).toBe("THEAD");
    expect(el.classList.contains("calendar-table-head")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
