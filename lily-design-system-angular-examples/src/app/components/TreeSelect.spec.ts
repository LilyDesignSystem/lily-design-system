import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeSelect } from "./TreeSelect";

describe("TreeSelect", () => {
  test("renders the select root with the base class", () => {
    const fixture = TestBed.createComponent(TreeSelect);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.tree-select");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeSelect);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("select.tree-select");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
