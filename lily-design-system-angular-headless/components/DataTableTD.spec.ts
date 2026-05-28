import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DataTableTD } from "./DataTableTD";

describe("DataTableTD", () => {
  test("renders the td root with the base class", () => {
    const fixture = TestBed.createComponent(DataTableTD);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.data-table-td");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DataTableTD);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.data-table-td");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
