import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableTD } from "./TableTD";

describe("TableTD", () => {
  test("renders the td root with the base class", () => {
    const fixture = TestBed.createComponent(TableTD);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.table-td");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TableTD);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("td.table-td");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
