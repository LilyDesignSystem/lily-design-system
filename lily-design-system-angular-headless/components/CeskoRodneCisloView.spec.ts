import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CeskoRodneCisloView } from "./CeskoRodneCisloView";

describe("CeskoRodneCisloView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(CeskoRodneCisloView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.cesko-rodne-cislo-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CeskoRodneCisloView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.cesko-rodne-cislo-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
