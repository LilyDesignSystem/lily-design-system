import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SummaryList } from "./SummaryList";

describe("SummaryList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(SummaryList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.summary-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SummaryList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.summary-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
