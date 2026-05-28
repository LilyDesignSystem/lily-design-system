import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Card } from "./Card";

describe("Card", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Card);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.card");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.card");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
