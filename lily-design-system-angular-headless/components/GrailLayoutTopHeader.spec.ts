import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GrailLayoutTopHeader } from "./GrailLayoutTopHeader";

describe("GrailLayoutTopHeader", () => {
  test("renders the header root with the base class", () => {
    const fixture = TestBed.createComponent(GrailLayoutTopHeader);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("header.grail-layout-top-header");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GrailLayoutTopHeader);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("header.grail-layout-top-header");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
