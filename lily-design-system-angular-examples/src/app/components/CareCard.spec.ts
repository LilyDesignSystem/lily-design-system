import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CareCard } from "./CareCard";

describe("CareCard", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(CareCard);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.care-card");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CareCard);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.care-card");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
