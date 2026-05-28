import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ReviewDate } from "./ReviewDate";

describe("ReviewDate", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ReviewDate);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.review-date");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ReviewDate);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.review-date");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
