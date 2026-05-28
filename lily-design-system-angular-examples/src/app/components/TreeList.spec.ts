import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeList } from "./TreeList";

describe("TreeList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(TreeList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.tree-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.tree-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
