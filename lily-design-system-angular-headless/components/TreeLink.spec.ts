import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeLink } from "./TreeLink";

describe("TreeLink", () => {
  test("renders the a root with the base class", () => {
    const fixture = TestBed.createComponent(TreeLink);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.tree-link");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeLink);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.tree-link");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
