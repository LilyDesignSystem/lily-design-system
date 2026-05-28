import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { WarningCallout } from "./WarningCallout";

describe("WarningCallout", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(WarningCallout);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.warning-callout");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(WarningCallout);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.warning-callout");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
