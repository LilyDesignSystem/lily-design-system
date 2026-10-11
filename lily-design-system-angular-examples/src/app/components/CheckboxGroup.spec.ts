import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CheckboxGroup } from "./CheckboxGroup";

describe("CheckboxGroup", () => {
  test("renders the fieldset root with the base class and role group", () => {
    const fixture = TestBed.createComponent(CheckboxGroup);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.checkbox-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CheckboxGroup);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("fieldset.checkbox-group");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
