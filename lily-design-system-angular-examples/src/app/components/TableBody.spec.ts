import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TableBody } from "./TableBody";

describe("TableBody", () => {
  test("renders the tbody root with the base class", () => {
    const fixture = TestBed.createComponent(TableBody);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody.table-body");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TableBody);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("tbody.table-body");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
