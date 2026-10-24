import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ConvertIntoDiv } from "./ConvertIntoDiv";

describe("ConvertIntoDiv", () => {
  test("renders the root with the base class", () => {
    const fixture = TestBed.createComponent(ConvertIntoDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.convert-into-div");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ConvertIntoDiv);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-into-div");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("has no role and no aria-label", () => {
    const fixture = TestBed.createComponent(ConvertIntoDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-into-div");
    expect(el.getAttribute("role")).toBeNull();
    expect(el.getAttribute("aria-label")).toBeNull();
  });
});
