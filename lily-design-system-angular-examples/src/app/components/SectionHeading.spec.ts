import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SectionHeading);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.section-heading");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SectionHeading);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.section-heading");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
