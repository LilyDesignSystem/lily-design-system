import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BodyText } from "./BodyText";

describe("BodyText", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(BodyText);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.body-text");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BodyText);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.body-text");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
