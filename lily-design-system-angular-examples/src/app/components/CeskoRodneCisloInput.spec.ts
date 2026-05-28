import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CeskoRodneCisloInput } from "./CeskoRodneCisloInput";

describe("CeskoRodneCisloInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(CeskoRodneCisloInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.cesko-rodne-cislo-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CeskoRodneCisloInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.cesko-rodne-cislo-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
