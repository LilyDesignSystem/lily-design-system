import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Table } from "./Table";

describe("Table", () => {
  test("renders the table root with the base class", () => {
    const fixture = TestBed.createComponent(Table);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("table.table");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Table);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("table.table");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
