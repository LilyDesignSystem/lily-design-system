import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LuxembourgMatriculeInput } from "./LuxembourgMatriculeInput";

describe("LuxembourgMatriculeInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(LuxembourgMatriculeInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.luxembourg-matricule-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LuxembourgMatriculeInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.luxembourg-matricule-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
