import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ErrorSummary } from "./ErrorSummary";

describe("ErrorSummary", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ErrorSummary);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.error-summary");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ErrorSummary);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.error-summary");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
