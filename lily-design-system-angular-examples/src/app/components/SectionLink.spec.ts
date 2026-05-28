import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SectionLink } from "./SectionLink";

describe("SectionLink", () => {
  test("renders the a root with the base class", () => {
    const fixture = TestBed.createComponent(SectionLink);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.section-link");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SectionLink);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.section-link");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
