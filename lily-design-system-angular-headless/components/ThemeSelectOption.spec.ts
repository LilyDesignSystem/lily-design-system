import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemeSelectOption } from "./ThemeSelectOption";

describe("ThemeSelectOption", () => {
  test("renders the option root with the base class", () => {
    const fixture = TestBed.createComponent(ThemeSelectOption);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("option.theme-select-option");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ThemeSelectOption);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("option.theme-select-option");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
