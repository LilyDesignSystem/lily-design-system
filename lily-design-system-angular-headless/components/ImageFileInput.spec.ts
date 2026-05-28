import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ImageFileInput } from "./ImageFileInput";

describe("ImageFileInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(ImageFileInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.image-file-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ImageFileInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.image-file-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
