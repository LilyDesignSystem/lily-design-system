import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PaginationNav } from "./PaginationNav";

describe("PaginationNav", () => {
  test("renders the nav root with the base class", () => {
    const fixture = TestBed.createComponent(PaginationNav);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.pagination-nav");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PaginationNav);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.pagination-nav");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
