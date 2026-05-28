import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextInputWithSearch } from "./TextInputWithSearch";

describe("TextInputWithSearch", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TextInputWithSearch);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.text-input-with-search");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TextInputWithSearch);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.text-input-with-search");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
