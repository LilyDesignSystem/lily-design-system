import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GoToNextSection } from "./GoToNextSection";

describe("GoToNextSection", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(GoToNextSection);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.go-to-next-section");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GoToNextSection);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.go-to-next-section");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
