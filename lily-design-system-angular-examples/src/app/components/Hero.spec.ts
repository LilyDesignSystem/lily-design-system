import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Hero } from "./Hero";

describe("Hero", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hero");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hero");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
