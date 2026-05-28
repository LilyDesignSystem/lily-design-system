import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(DropdownMenu);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dropdown-menu");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DropdownMenu);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.dropdown-menu");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
