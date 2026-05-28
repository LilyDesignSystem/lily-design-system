import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ValidationListItem } from "./ValidationListItem";

describe("ValidationListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(ValidationListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.validation-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ValidationListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.validation-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
