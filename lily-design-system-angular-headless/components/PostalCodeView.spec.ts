import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PostalCodeView } from "./PostalCodeView";

describe("PostalCodeView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(PostalCodeView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.postal-code-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PostalCodeView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.postal-code-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
