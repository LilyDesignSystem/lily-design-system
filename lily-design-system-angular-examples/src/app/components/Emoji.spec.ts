import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Emoji } from "./Emoji";

describe("Emoji", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Emoji);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.emoji");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Emoji);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.emoji");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
