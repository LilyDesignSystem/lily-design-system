import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ClampText } from "./ClampText";

describe("ClampText", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ClampText);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.clamp-text");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ClampText);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.clamp-text");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
