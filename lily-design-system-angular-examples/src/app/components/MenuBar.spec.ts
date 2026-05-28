import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MenuBar } from "./MenuBar";

describe("MenuBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.menu-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.menu-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
