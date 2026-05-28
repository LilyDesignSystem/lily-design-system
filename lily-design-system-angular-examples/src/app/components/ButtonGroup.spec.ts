import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ButtonGroup);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.button-group");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ButtonGroup);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.button-group");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
