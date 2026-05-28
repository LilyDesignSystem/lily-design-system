import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RomaniaPasaportInput } from "./RomaniaPasaportInput";

describe("RomaniaPasaportInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(RomaniaPasaportInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.romania-pasaport-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RomaniaPasaportInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.romania-pasaport-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
