import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LatvijaPersonasKodsInput } from "./LatvijaPersonasKodsInput";

describe("LatvijaPersonasKodsInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(LatvijaPersonasKodsInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.latvija-personas-kods-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LatvijaPersonasKodsInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.latvija-personas-kods-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
