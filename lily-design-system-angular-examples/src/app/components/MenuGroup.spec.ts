import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MenuGroup } from "./MenuGroup";

describe("MenuGroup", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(MenuGroup);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.menu-group");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MenuGroup);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.menu-group");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
