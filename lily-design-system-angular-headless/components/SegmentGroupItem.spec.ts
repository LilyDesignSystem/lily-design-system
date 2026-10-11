import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SegmentGroupItem } from "./SegmentGroupItem";

describe("SegmentGroupItem", () => {
  test("renders a button root with role radio and the base class", () => {
    const fixture = TestBed.createComponent(SegmentGroupItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.segment-group-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SegmentGroupItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.segment-group-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("reflects checked as aria-checked and the roving tab stop", () => {
    const fixture = TestBed.createComponent(SegmentGroupItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.segment-group-item");
    expect(el.getAttribute("role")).toBe("radio");
    expect(el.getAttribute("type")).toBe("button");
    expect(el.getAttribute("aria-checked")).toBe("false");
    expect(el.getAttribute("tabindex")).toBe("-1");
    fixture.componentRef.setInput("checked", true);
    fixture.componentRef.setInput("value", "week");
    fixture.detectChanges();
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.getAttribute("data-value")).toBe("week");
  });

  test("disabled disables the button", () => {
    const fixture = TestBed.createComponent(SegmentGroupItem);
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("button.segment-group-item").disabled).toBe(true);
  });
});
