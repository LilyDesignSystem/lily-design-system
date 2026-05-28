import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HamburgerMenu } from "./HamburgerMenu";

describe("HamburgerMenu", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(HamburgerMenu);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hamburger-menu");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HamburgerMenu);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hamburger-menu");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
