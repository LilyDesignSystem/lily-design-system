import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Flair } from "./Flair";

describe("Flair", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Flair);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.flair");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Flair);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.flair");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
