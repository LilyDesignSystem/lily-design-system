import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedAmberGreenPicker } from "./RedAmberGreenPicker";

describe("RedAmberGreenPicker", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(RedAmberGreenPicker);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.red-amber-green-picker");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RedAmberGreenPicker);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.red-amber-green-picker");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
