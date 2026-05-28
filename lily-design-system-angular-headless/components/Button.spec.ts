import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Button } from "./Button";

describe("Button", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
