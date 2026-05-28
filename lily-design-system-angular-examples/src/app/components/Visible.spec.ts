import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Visible } from "./Visible";

describe("Visible", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Visible);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.visible");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Visible);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.visible");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
