import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HrvatskaOsobniIdentifikacijskiBrojView } from "./HrvatskaOsobniIdentifikacijskiBrojView";

describe("HrvatskaOsobniIdentifikacijskiBrojView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(HrvatskaOsobniIdentifikacijskiBrojView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.hrvatska-osobni-identifikacijski-broj-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HrvatskaOsobniIdentifikacijskiBrojView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.hrvatska-osobni-identifikacijski-broj-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
