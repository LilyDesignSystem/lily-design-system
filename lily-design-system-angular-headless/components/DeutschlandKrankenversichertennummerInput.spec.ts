import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DeutschlandKrankenversichertennummerInput } from "./DeutschlandKrankenversichertennummerInput";

describe("DeutschlandKrankenversichertennummerInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(DeutschlandKrankenversichertennummerInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.deutschland-krankenversichertennummer-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(DeutschlandKrankenversichertennummerInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.deutschland-krankenversichertennummer-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
