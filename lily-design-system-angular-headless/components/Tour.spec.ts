import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Tour } from "./Tour";

describe("Tour", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Tour);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tour");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Tour);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tour");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
