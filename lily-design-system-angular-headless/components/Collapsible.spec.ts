import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Collapsible } from "./Collapsible";

describe("Collapsible", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Collapsible);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.collapsible");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Collapsible);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.collapsible");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
