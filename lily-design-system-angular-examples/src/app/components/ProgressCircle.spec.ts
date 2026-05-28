import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ProgressCircle } from "./ProgressCircle";

describe("ProgressCircle", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ProgressCircle);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.progress-circle");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ProgressCircle);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.progress-circle");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
