import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GrailLayoutRightAside } from "./GrailLayoutRightAside";

describe("GrailLayoutRightAside", () => {
  test("renders the aside root with the base class", () => {
    const fixture = TestBed.createComponent(GrailLayoutRightAside);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("aside.grail-layout-right-aside");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GrailLayoutRightAside);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("aside.grail-layout-right-aside");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
