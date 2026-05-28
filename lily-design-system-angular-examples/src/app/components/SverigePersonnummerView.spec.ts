import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SverigePersonnummerView } from "./SverigePersonnummerView";

describe("SverigePersonnummerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(SverigePersonnummerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.sverige-personnummer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SverigePersonnummerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.sverige-personnummer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
