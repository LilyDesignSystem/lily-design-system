import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedOrangeYellowGreenBlueView } from "./RedOrangeYellowGreenBlueView";

describe("RedOrangeYellowGreenBlueView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(RedOrangeYellowGreenBlueView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.red-orange-yellow-green-blue-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RedOrangeYellowGreenBlueView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.red-orange-yellow-green-blue-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
