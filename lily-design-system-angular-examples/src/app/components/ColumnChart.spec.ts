import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ColumnChart } from "./ColumnChart";

describe("ColumnChart", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ColumnChart);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.column-chart");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ColumnChart);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.column-chart");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
