import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Separator } from "./Separator";

describe("Separator", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Separator);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.separator");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Separator);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.separator");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
