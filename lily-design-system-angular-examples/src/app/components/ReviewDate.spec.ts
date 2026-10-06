import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ReviewDate } from "./ReviewDate";

describe("ReviewDate", () => {
  test("renders a time root with the base class", () => {
    const fixture = TestBed.createComponent(ReviewDate);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("time.review-date")).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ReviewDate);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("time.review-date").classList.contains("extra")).toBe(true);
  });

  test("renders datetime and aria-label when given, and omits them otherwise", () => {
    const fixture = TestBed.createComponent(ReviewDate);
    fixture.detectChanges();
    const bare = fixture.nativeElement.querySelector("time");
    expect(bare.hasAttribute("datetime")).toBe(false);
    expect(bare.hasAttribute("aria-label")).toBe(false);
    fixture.componentRef.setInput("datetime", "2026-10-06");
    fixture.componentRef.setInput("label", "Last reviewed");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("time");
    expect(el.getAttribute("datetime")).toBe("2026-10-06");
    expect(el.getAttribute("aria-label")).toBe("Last reviewed");
  });
});
