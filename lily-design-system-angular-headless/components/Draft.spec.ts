import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Draft } from "./Draft";

describe("Draft", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Draft);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.draft");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Draft);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.draft");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("reflects status input as data-status attribute", () => {
    const fixture = TestBed.createComponent(Draft);
    fixture.componentRef.setInput("status", "in-progress");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.draft");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-status")).toBe("in-progress");
  });
});
