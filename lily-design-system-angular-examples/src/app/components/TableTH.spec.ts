import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableTH } from "./TableTH";

describe("TableTH", () => {
  test("renders the th root with the base class", () => {
    const fixture = TestBed.createComponent(TableTH);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("th.table-th");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TableTH);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("th.table-th");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
