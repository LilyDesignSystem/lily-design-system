import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Dial } from "./Dial";

describe("Dial", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Dial);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dial");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Dial);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dial");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
