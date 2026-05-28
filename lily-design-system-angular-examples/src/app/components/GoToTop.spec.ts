import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GoToTop } from "./GoToTop";

describe("GoToTop", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(GoToTop);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.go-to-top");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GoToTop);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.go-to-top");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
