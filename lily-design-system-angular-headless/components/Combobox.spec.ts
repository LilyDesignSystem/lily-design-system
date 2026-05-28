import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Combobox } from "./Combobox";

describe("Combobox", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.combobox");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.combobox");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
