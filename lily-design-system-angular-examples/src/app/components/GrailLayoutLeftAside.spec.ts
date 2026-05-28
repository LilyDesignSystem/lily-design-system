import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GrailLayoutLeftAside } from "./GrailLayoutLeftAside";

describe("GrailLayoutLeftAside", () => {
  test("renders the aside root with the base class", () => {
    const fixture = TestBed.createComponent(GrailLayoutLeftAside);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("aside.grail-layout-left-aside");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GrailLayoutLeftAside);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("aside.grail-layout-left-aside");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
