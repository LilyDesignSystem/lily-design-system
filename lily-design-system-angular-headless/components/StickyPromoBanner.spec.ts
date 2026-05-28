import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StickyPromoBanner } from "./StickyPromoBanner";

describe("StickyPromoBanner", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(StickyPromoBanner);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.sticky-promo-banner");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(StickyPromoBanner);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.sticky-promo-banner");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
