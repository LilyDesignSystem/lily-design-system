import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Hint } from "./Hint";

describe("Hint", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Hint);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hint");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Hint);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hint");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
