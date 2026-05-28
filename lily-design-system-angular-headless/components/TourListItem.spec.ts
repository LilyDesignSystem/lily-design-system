import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TourListItem } from "./TourListItem";

describe("TourListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(TourListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.tour-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TourListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.tour-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
