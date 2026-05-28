import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveFaceRatingPickerButton } from "./FiveFaceRatingPickerButton";

describe("FiveFaceRatingPickerButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(FiveFaceRatingPickerButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.five-face-rating-picker-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FiveFaceRatingPickerButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.five-face-rating-picker-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
