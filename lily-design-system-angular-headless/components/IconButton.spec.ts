import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.icon-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.icon-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
