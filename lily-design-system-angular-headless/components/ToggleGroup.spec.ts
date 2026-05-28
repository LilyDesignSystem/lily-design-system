import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ToggleGroup } from "./ToggleGroup";

describe("ToggleGroup", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ToggleGroup);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.toggle-group");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ToggleGroup);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.toggle-group");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
