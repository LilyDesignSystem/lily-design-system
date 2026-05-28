import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeListItem } from "./TreeListItem";

describe("TreeListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(TreeListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.tree-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.tree-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
