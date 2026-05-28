import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableRow } from "./TableRow";

describe("TableRow", () => {
  test("renders the tr root with the base class", () => {
    const fixture = TestBed.createComponent(TableRow);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr.table-row");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TableRow);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tr.table-row");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
