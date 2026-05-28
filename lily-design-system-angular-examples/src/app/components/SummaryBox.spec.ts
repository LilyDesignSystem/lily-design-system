import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SummaryBox } from "./SummaryBox";

describe("SummaryBox", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SummaryBox);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.summary-box");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SummaryBox);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.summary-box");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
