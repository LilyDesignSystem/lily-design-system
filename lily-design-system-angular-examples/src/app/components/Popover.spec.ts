import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Popover } from "./Popover";

describe("Popover", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Popover);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.popover");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Popover);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.popover");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
