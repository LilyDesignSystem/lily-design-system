import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemeSelectButton } from "./ThemeSelectButton";

describe("ThemeSelectButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(ThemeSelectButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.theme-select-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ThemeSelectButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.theme-select-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
