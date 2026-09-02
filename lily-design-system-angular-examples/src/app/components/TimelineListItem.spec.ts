import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TimelineListItem } from "./TimelineListItem";

// TimelineListItem is an attribute-selector component (`li[lily-timeline-list-item]`): its host is the
// native <li> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(TimelineListItem)` directly (the
// latter has no <li> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [TimelineListItem],
  template: `<li lily-timeline-list-item [className]="className"></li>`,
})
class TestHost {
  className = "";
}

describe("TimelineListItem", () => {
  test("the host is the li itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.tagName).toBe("LI");
    expect(el.classList.contains("timeline-list-item")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.classList.contains("extra")).toBe(true);
  });
});
