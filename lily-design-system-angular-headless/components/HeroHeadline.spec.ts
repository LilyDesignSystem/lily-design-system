import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HeroHeadline } from "./HeroHeadline";

describe("HeroHeadline", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(HeroHeadline);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hero-headline");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HeroHeadline);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hero-headline");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
