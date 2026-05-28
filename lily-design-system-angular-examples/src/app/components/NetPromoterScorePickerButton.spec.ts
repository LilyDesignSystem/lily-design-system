import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NetPromoterScorePickerButton } from "./NetPromoterScorePickerButton";

describe("NetPromoterScorePickerButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(NetPromoterScorePickerButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.net-promoter-score-picker-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NetPromoterScorePickerButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.net-promoter-score-picker-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
