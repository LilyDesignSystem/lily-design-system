import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SectionList } from "./SectionList";

describe("SectionList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(SectionList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.section-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SectionList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.section-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
