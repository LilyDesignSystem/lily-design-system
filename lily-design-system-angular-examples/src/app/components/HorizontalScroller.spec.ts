import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HorizontalScroller } from "./HorizontalScroller";

describe("HorizontalScroller", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(HorizontalScroller);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.horizontal-scroller");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HorizontalScroller);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.horizontal-scroller");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
