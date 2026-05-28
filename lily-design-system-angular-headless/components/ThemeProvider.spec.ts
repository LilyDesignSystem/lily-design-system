import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemeProvider } from "./ThemeProvider";

describe("ThemeProvider", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ThemeProvider);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.theme-provider");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ThemeProvider);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.theme-provider");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
