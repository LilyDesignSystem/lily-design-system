import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableHead } from "./TableHead";

describe("TableHead", () => {
  test("renders the thead root with the base class", () => {
    const fixture = TestBed.createComponent(TableHead);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.table-head");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TableHead);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.table-head");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
