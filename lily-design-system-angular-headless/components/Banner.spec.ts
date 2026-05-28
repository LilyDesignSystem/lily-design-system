import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Banner } from "./Banner";

describe("Banner", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Banner);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.banner");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Banner);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.banner");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
