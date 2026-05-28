import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FlexStack } from "./FlexStack";

describe("FlexStack", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(FlexStack);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.flex-stack");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FlexStack);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.flex-stack");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
