import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LiechtensteinNationalIdentityCardNumberView } from "./LiechtensteinNationalIdentityCardNumberView";

describe("LiechtensteinNationalIdentityCardNumberView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(LiechtensteinNationalIdentityCardNumberView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.liechtenstein-national-identity-card-number-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LiechtensteinNationalIdentityCardNumberView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.liechtenstein-national-identity-card-number-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
