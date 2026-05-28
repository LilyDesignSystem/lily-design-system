import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(SearchInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.search-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SearchInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.search-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
