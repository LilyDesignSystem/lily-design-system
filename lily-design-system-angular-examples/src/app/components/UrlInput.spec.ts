import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { UrlInput } from "./UrlInput";

describe("UrlInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(UrlInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.url-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(UrlInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.url-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
