import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SummaryListItem } from "./SummaryListItem";

describe("SummaryListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(SummaryListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.summary-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SummaryListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.summary-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
