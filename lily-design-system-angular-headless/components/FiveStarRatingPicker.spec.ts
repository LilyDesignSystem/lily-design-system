import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveStarRatingPicker } from "./FiveStarRatingPicker";

describe("FiveStarRatingPicker", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(FiveStarRatingPicker);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.five-star-rating-picker");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FiveStarRatingPicker);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.five-star-rating-picker");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
