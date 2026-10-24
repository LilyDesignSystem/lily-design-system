import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ConvertIntoValueDiv } from "./ConvertIntoValueDiv";

describe("ConvertIntoValueDiv", () => {
  test("renders the root with the base class", () => {
    const fixture = TestBed.createComponent(ConvertIntoValueDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.convert-into-value-div");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ConvertIntoValueDiv);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-into-value-div");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("has no role and no aria-label", () => {
    const fixture = TestBed.createComponent(ConvertIntoValueDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".convert-into-value-div");
    expect(el.getAttribute("role")).toBeNull();
    expect(el.getAttribute("aria-label")).toBeNull();
  });
});
