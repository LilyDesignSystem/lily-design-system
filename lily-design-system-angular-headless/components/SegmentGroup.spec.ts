import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SegmentGroup } from "./SegmentGroup";

describe("SegmentGroup", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SegmentGroup);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.segment-group");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SegmentGroup);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.segment-group");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
