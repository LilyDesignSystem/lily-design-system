import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Autosuggest } from "./Autosuggest";

describe("Autosuggest", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Autosuggest);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.autosuggest");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Autosuggest);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.autosuggest");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
