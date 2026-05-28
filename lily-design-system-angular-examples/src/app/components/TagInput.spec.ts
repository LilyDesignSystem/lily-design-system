import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TagInput } from "./TagInput";

describe("TagInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(TagInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.tag-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TagInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.tag-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
