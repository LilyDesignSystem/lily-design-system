import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GrailLayoutCenterMain } from "./GrailLayoutCenterMain";

describe("GrailLayoutCenterMain", () => {
  test("renders the main root with the base class", () => {
    const fixture = TestBed.createComponent(GrailLayoutCenterMain);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("main.grail-layout-center-main");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GrailLayoutCenterMain);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("main.grail-layout-center-main");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
