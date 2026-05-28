import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedAmberGreenView } from "./RedAmberGreenView";

describe("RedAmberGreenView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(RedAmberGreenView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.red-amber-green-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RedAmberGreenView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.red-amber-green-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
