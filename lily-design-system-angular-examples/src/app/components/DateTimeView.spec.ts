import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateTimeView } from "./DateTimeView";

describe("DateTimeView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(DateTimeView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.date-time-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DateTimeView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.date-time-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
