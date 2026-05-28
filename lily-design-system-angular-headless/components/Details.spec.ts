import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Details } from "./Details";

describe("Details", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Details);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.details");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Details);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.details");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
