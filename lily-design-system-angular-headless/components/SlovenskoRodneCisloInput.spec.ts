import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SlovenskoRodneCisloInput } from "./SlovenskoRodneCisloInput";

describe("SlovenskoRodneCisloInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(SlovenskoRodneCisloInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.slovensko-rodne-cislo-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SlovenskoRodneCisloInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.slovensko-rodne-cislo-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
