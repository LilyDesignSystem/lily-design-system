import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NederlandIdentiteitskaartNummerView } from "./NederlandIdentiteitskaartNummerView";

describe("NederlandIdentiteitskaartNummerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(NederlandIdentiteitskaartNummerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.nederland-identiteitskaart-nummer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NederlandIdentiteitskaartNummerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.nederland-identiteitskaart-nummer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
