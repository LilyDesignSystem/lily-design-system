import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SliderButton } from "./SliderButton";

describe("SliderButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(SliderButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.slider-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SliderButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.slider-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
