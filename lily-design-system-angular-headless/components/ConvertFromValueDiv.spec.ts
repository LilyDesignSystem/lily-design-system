import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ConvertFromValueDiv } from "./ConvertFromValueDiv";

describe("ConvertFromValueDiv", () => {
  test("renders the root with the base class", () => {
    const fixture = TestBed.createComponent(ConvertFromValueDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.convert-from-value-div");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ConvertFromValueDiv);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-from-value-div");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("has no role and no aria-label", () => {
    const fixture = TestBed.createComponent(ConvertFromValueDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-from-value-div");
    expect(el.getAttribute("role")).toBeNull();
    expect(el.getAttribute("aria-label")).toBeNull();
  });
});
