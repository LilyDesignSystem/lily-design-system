import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Meter } from "./Meter";

describe("Meter", () => {
  test("renders the meter root with the base class", () => {
    const fixture = TestBed.createComponent(Meter);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("meter.meter");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Meter);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("meter.meter");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
