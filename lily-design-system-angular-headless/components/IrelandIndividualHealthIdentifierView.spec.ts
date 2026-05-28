import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IrelandIndividualHealthIdentifierView } from "./IrelandIndividualHealthIdentifierView";

describe("IrelandIndividualHealthIdentifierView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(IrelandIndividualHealthIdentifierView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.ireland-individual-health-identifier-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(IrelandIndividualHealthIdentifierView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.ireland-individual-health-identifier-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
