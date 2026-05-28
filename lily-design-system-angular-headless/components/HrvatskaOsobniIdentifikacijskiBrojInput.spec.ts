import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HrvatskaOsobniIdentifikacijskiBrojInput } from "./HrvatskaOsobniIdentifikacijskiBrojInput";

describe("HrvatskaOsobniIdentifikacijskiBrojInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(HrvatskaOsobniIdentifikacijskiBrojInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.hrvatska-osobni-identifikacijski-broj-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HrvatskaOsobniIdentifikacijskiBrojInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.hrvatska-osobni-identifikacijski-broj-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
