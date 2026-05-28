import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TelLink } from "./TelLink";

describe("TelLink", () => {
  test("renders the a root with the base class", () => {
    const fixture = TestBed.createComponent(TelLink);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.tel-link");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TelLink);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.tel-link");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
