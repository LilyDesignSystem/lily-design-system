import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedOrangeYellowGreenBluePicker } from "./RedOrangeYellowGreenBluePicker";

describe("RedOrangeYellowGreenBluePicker", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(RedOrangeYellowGreenBluePicker);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.red-orange-yellow-green-blue-picker");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RedOrangeYellowGreenBluePicker);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.red-orange-yellow-green-blue-picker");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
