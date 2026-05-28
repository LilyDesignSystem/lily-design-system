import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Affix } from "./Affix";

describe("Affix", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Affix);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.affix");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Affix);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.affix");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
