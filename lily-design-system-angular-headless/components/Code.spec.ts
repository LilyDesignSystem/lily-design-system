import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Code } from "./Code";

describe("Code", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Code);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.code");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Code);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.code");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
