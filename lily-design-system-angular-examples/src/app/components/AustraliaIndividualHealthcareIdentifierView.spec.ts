import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AustraliaIndividualHealthcareIdentifierView } from "./AustraliaIndividualHealthcareIdentifierView";

describe("AustraliaIndividualHealthcareIdentifierView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(AustraliaIndividualHealthcareIdentifierView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.australia-individual-healthcare-identifier-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AustraliaIndividualHealthcareIdentifierView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.australia-individual-healthcare-identifier-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
