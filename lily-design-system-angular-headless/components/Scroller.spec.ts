import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Scroller } from "./Scroller";

describe("Scroller", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Scroller);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroller");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Scroller);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroller");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
