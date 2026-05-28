import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { InfoState } from "./InfoState";

describe("InfoState", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(InfoState);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.info-state");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(InfoState);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.info-state");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
