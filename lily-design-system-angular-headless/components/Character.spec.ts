import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Character } from "./Character";

describe("Character", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Character);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.character");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Character);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.character");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
