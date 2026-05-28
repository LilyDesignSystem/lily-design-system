import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScreenReaderSpan } from "./ScreenReaderSpan";

describe("ScreenReaderSpan", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(ScreenReaderSpan);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.screen-reader-span");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ScreenReaderSpan);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.screen-reader-span");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
