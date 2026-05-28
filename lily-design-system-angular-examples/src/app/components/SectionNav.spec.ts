import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SectionNav } from "./SectionNav";

describe("SectionNav", () => {
  test("renders the nav root with the base class", () => {
    const fixture = TestBed.createComponent(SectionNav);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.section-nav");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SectionNav);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.section-nav");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
