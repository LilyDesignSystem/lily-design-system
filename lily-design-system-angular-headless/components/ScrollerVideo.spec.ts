import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollerVideo } from "./ScrollerVideo";

describe("ScrollerVideo", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ScrollerVideo);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroller-video");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ScrollerVideo);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroller-video");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
