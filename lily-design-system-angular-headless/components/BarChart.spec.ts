import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BarChart } from "./BarChart";

describe("BarChart", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.bar-chart");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.bar-chart");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
