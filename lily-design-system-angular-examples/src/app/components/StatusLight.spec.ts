import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StatusLight } from "./StatusLight";

describe("StatusLight", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(StatusLight);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.status-light");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(StatusLight);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.status-light");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
