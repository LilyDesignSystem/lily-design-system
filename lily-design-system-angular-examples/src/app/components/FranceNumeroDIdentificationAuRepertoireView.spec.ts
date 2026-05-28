import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FranceNumeroDIdentificationAuRepertoireView } from "./FranceNumeroDIdentificationAuRepertoireView";

describe("FranceNumeroDIdentificationAuRepertoireView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(FranceNumeroDIdentificationAuRepertoireView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.france-numero-d-identification-au-repertoire-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FranceNumeroDIdentificationAuRepertoireView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.france-numero-d-identification-au-repertoire-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
