import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemeSelect } from "./ThemeSelect";

describe("ThemeSelect", () => {
  test("renders the select root with the base class", () => {
    const fixture = TestBed.createComponent(ThemeSelect);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.theme-select");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ThemeSelect);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.theme-select");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
