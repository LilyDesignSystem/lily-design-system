import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AddressographBox } from "./AddressographBox";

describe("AddressographBox", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(AddressographBox);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.addressograph-box");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AddressographBox);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.addressograph-box");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
