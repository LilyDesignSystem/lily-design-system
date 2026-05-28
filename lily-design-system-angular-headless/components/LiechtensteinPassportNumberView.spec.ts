import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LiechtensteinPassportNumberView } from "./LiechtensteinPassportNumberView";

describe("LiechtensteinPassportNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(LiechtensteinPassportNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.liechtenstein-passport-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LiechtensteinPassportNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.liechtenstein-passport-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
