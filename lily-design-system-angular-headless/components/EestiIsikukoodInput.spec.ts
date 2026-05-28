import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EestiIsikukoodInput } from "./EestiIsikukoodInput";

describe("EestiIsikukoodInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(EestiIsikukoodInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.eesti-isikukood-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EestiIsikukoodInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.eesti-isikukood-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
