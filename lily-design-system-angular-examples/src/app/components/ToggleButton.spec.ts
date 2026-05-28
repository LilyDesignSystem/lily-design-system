import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(ToggleButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.toggle-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ToggleButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.toggle-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
