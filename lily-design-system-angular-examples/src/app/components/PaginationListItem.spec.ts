import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PaginationListItem } from "./PaginationListItem";

describe("PaginationListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(PaginationListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.pagination-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PaginationListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.pagination-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
