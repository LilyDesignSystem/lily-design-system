import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SlideOutDrawer } from "./SlideOutDrawer";

describe("SlideOutDrawer", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SlideOutDrawer);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.slide-out-drawer");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SlideOutDrawer);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.slide-out-drawer");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
