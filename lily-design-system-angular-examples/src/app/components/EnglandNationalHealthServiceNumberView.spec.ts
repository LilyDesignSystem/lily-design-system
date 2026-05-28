import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EnglandNationalHealthServiceNumberView } from "./EnglandNationalHealthServiceNumberView";

describe("EnglandNationalHealthServiceNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(EnglandNationalHealthServiceNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.england-national-health-service-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EnglandNationalHealthServiceNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.england-national-health-service-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
