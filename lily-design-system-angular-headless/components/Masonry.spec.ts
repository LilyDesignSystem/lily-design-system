import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Masonry } from "./Masonry";

describe("Masonry", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Masonry);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.masonry");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Masonry);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.masonry");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
