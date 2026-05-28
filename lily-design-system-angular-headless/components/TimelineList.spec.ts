import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TimelineList } from "./TimelineList";

describe("TimelineList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(TimelineList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.timeline-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TimelineList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.timeline-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
