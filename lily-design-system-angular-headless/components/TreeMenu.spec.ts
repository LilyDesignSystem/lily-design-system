import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeMenu } from "./TreeMenu";

describe("TreeMenu", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TreeMenu);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tree-menu");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeMenu);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tree-menu");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
