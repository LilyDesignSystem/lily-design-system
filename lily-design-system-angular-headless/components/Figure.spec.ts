import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Figure } from "./Figure";

describe("Figure", () => {
  test("renders the figure root with the base class", () => {
    const fixture = TestBed.createComponent(Figure);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("figure.figure");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Figure);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("figure.figure");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
