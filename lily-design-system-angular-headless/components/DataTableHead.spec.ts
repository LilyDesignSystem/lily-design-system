import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DataTableHead } from "./DataTableHead";

describe("DataTableHead", () => {
  test("renders the thead root with the base class", () => {
    const fixture = TestBed.createComponent(DataTableHead);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.data-table-head");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DataTableHead);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("thead.data-table-head");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
