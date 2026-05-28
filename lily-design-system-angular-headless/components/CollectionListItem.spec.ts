import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CollectionListItem } from "./CollectionListItem";

describe("CollectionListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(CollectionListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.collection-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CollectionListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.collection-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
