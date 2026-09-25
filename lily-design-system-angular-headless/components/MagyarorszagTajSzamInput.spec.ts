import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MagyarorszagTajSzamInput } from "./MagyarorszagTajSzamInput";

describe("MagyarorszagTajSzamInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(MagyarorszagTajSzamInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.magyarorszag-taj-szam-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MagyarorszagTajSzamInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.magyarorszag-taj-szam-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
