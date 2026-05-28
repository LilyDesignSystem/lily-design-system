import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DanmarkPersonnummerView } from "./DanmarkPersonnummerView";

describe("DanmarkPersonnummerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(DanmarkPersonnummerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.danmark-personnummer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DanmarkPersonnummerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.danmark-personnummer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
