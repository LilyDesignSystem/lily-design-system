import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TuaisceartEireannHealthAndCareNumberView } from "./TuaisceartEireannHealthAndCareNumberView";

describe("TuaisceartEireannHealthAndCareNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(TuaisceartEireannHealthAndCareNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.tuaisceart-eireann-health-and-care-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TuaisceartEireannHealthAndCareNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.tuaisceart-eireann-health-and-care-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
