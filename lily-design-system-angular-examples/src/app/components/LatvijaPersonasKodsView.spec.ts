import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LatvijaPersonasKodsView } from "./LatvijaPersonasKodsView";

describe("LatvijaPersonasKodsView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(LatvijaPersonasKodsView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.latvija-personas-kods-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LatvijaPersonasKodsView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.latvija-personas-kods-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
