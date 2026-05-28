import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NederlandPaspoortNummerInput } from "./NederlandPaspoortNummerInput";

describe("NederlandPaspoortNummerInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(NederlandPaspoortNummerInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.nederland-paspoort-nummer-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(NederlandPaspoortNummerInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.nederland-paspoort-nummer-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
