import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LietuvaAsmensKodasInput } from "./LietuvaAsmensKodasInput";

describe("LietuvaAsmensKodasInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(LietuvaAsmensKodasInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.lietuva-asmens-kodas-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LietuvaAsmensKodasInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.lietuva-asmens-kodas-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
