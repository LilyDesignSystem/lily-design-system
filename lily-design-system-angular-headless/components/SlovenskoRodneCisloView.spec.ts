import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SlovenskoRodneCisloView } from "./SlovenskoRodneCisloView";

describe("SlovenskoRodneCisloView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(SlovenskoRodneCisloView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.slovensko-rodne-cislo-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SlovenskoRodneCisloView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.slovensko-rodne-cislo-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
