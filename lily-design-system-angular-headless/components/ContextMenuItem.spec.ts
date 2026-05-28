import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContextMenuItem } from "./ContextMenuItem";

describe("ContextMenuItem", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ContextMenuItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.context-menu-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContextMenuItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.context-menu-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
