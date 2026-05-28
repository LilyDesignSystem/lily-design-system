import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GrailLayout } from "./GrailLayout";

describe("GrailLayout", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(GrailLayout);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.grail-layout");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GrailLayout);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.grail-layout");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
