import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TurkiyeTcKimlikNumarasiInput } from "./TurkiyeTcKimlikNumarasiInput";

describe("TurkiyeTcKimlikNumarasiInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(TurkiyeTcKimlikNumarasiInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.turkiye-tc-kimlik-numarasi-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TurkiyeTcKimlikNumarasiInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.turkiye-tc-kimlik-numarasi-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
