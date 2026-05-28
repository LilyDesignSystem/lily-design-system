import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Byline } from "./Byline";

describe("Byline", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Byline);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.byline");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Byline);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.byline");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
