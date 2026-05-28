import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveFaceRatingView } from "./FiveFaceRatingView";

describe("FiveFaceRatingView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(FiveFaceRatingView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.five-face-rating-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FiveFaceRatingView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.five-face-rating-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
