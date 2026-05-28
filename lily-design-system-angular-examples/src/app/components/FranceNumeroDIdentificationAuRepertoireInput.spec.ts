import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FranceNumeroDIdentificationAuRepertoireInput } from "./FranceNumeroDIdentificationAuRepertoireInput";

describe("FranceNumeroDIdentificationAuRepertoireInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(FranceNumeroDIdentificationAuRepertoireInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.france-numero-d-identification-au-repertoire-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FranceNumeroDIdentificationAuRepertoireInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.france-numero-d-identification-au-repertoire-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
