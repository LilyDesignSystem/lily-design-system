import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveStarRatingPickerButton } from "./FiveStarRatingPickerButton";

describe("FiveStarRatingPickerButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(FiveStarRatingPickerButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.five-star-rating-picker-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FiveStarRatingPickerButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.five-star-rating-picker-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
