import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Blockquote } from "./Blockquote";

describe("Blockquote", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Blockquote);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.blockquote");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Blockquote);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.blockquote");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
