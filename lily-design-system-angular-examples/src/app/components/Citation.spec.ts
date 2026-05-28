import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Citation } from "./Citation";

describe("Citation", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Citation);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.citation");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Citation);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.citation");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
