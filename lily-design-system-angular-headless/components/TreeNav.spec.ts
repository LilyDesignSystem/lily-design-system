import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeNav } from "./TreeNav";

describe("TreeNav", () => {
  test("renders the nav root with the base class", () => {
    const fixture = TestBed.createComponent(TreeNav);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.tree-nav");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeNav);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("nav.tree-nav");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
