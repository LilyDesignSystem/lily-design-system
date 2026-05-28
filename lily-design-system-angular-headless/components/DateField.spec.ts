import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateField } from "./DateField";

describe("DateField", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(DateField);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.date-field");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DateField);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.date-field");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
