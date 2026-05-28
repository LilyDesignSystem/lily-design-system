import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ActionBar } from "./ActionBar";

describe("ActionBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ActionBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.action-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ActionBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.action-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
