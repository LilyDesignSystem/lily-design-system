import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DoListItem } from "./DoListItem";

describe("DoListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(DoListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.do-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DoListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.do-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
