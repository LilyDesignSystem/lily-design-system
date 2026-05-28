import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FloatingPanel } from "./FloatingPanel";

describe("FloatingPanel", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(FloatingPanel);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.floating-panel");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FloatingPanel);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.floating-panel");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
