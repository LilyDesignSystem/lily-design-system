import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Fieldset } from "./Fieldset";

describe("Fieldset", () => {
  test("renders the fieldset root with the base class", () => {
    const fixture = TestBed.createComponent(Fieldset);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.fieldset");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Fieldset);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.fieldset");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
