import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RossiyaSnilsView } from "./RossiyaSnilsView";

describe("RossiyaSnilsView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(RossiyaSnilsView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.rossiya-snils-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RossiyaSnilsView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.rossiya-snils-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
