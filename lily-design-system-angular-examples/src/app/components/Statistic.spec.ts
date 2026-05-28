import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Statistic } from "./Statistic";

describe("Statistic", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Statistic);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.statistic");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Statistic);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.statistic");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
