import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IrelandIndividualHealthIdentifierInput } from "./IrelandIndividualHealthIdentifierInput";

describe("IrelandIndividualHealthIdentifierInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(IrelandIndividualHealthIdentifierInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.ireland-individual-health-identifier-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(IrelandIndividualHealthIdentifierInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.ireland-individual-health-identifier-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
