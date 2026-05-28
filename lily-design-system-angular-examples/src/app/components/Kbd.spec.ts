import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Kbd } from "./Kbd";

describe("Kbd", () => {
  test("renders the kbd root with the base class", () => {
    const fixture = TestBed.createComponent(Kbd);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("kbd.kbd");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Kbd);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("kbd.kbd");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
