import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Tooltip);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tooltip");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Tooltip);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tooltip");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
