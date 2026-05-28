import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ProgressBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.progress-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ProgressBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.progress-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
