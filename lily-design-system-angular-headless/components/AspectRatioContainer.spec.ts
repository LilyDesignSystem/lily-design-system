import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AspectRatioContainer } from "./AspectRatioContainer";

describe("AspectRatioContainer", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(AspectRatioContainer);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.aspect-ratio-container");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AspectRatioContainer);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.aspect-ratio-container");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
