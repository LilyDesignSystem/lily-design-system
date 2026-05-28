import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BulgariaEdinenGrazhdanskiNomerInput } from "./BulgariaEdinenGrazhdanskiNomerInput";

describe("BulgariaEdinenGrazhdanskiNomerInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(BulgariaEdinenGrazhdanskiNomerInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.bulgaria-edinen-grazhdanski-nomer-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BulgariaEdinenGrazhdanskiNomerInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.bulgaria-edinen-grazhdanski-nomer-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
