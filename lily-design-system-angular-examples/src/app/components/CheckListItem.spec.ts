import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CheckListItem } from "./CheckListItem";

describe("CheckListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(CheckListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.check-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CheckListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.check-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
