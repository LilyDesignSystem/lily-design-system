import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { InsetText } from "./InsetText";

describe("InsetText", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(InsetText);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.inset-text");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(InsetText);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.inset-text");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
