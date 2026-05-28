import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Watermark } from "./Watermark";

describe("Watermark", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Watermark);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.watermark");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Watermark);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.watermark");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
