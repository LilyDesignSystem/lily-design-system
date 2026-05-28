import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Pictogram } from "./Pictogram";

describe("Pictogram", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Pictogram);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.pictogram");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Pictogram);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.pictogram");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
