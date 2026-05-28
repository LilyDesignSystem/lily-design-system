import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemePicker } from "./ThemePicker";

describe("ThemePicker", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.theme-picker");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ThemePicker);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.theme-picker");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
