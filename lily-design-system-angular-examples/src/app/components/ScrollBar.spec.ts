import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollBar } from "./ScrollBar";

describe("ScrollBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ScrollBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroll-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ScrollBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroll-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
