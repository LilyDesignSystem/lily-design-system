import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ConvertDiv } from "./ConvertDiv";

describe("ConvertDiv", () => {
  test("renders the root with the base class", () => {
    const fixture = TestBed.createComponent(ConvertDiv);
    fixture.componentRef.setInput("label", "Currency converter");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.convert-div");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ConvertDiv);
    fixture.componentRef.setInput("label", "Currency converter");
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-div");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("is a named group", () => {
    const fixture = TestBed.createComponent(ConvertDiv);
    fixture.componentRef.setInput("label", "Currency converter");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-div");
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("Currency converter");
  });
});
