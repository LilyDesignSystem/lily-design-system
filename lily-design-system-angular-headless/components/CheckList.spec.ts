import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CheckList } from "./CheckList";

describe("CheckList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(CheckList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.check-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CheckList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.check-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
