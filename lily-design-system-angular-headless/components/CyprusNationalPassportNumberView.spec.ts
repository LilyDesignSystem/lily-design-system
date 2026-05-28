import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CyprusNationalPassportNumberView } from "./CyprusNationalPassportNumberView";

describe("CyprusNationalPassportNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(CyprusNationalPassportNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.cyprus-national-passport-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CyprusNationalPassportNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.cyprus-national-passport-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
