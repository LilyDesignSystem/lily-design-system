import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollerBase } from "./ScrollerBase";

describe("ScrollerBase", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ScrollerBase);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroller-base");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ScrollerBase);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroller-base");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
