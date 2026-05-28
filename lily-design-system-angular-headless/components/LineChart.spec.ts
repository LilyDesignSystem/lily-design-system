import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LineChart } from "./LineChart";

describe("LineChart", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(LineChart);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.line-chart");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(LineChart);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.line-chart");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
