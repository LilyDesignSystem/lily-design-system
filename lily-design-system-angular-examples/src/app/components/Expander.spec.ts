import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Expander } from "./Expander";

describe("Expander", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Expander);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.expander");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Expander);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.expander");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
