import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SelectWithExtras } from "./SelectWithExtras";

describe("SelectWithExtras", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SelectWithExtras);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.select-with-extras");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SelectWithExtras);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.select-with-extras");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
