import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GrailLayoutBottomFooter } from "./GrailLayoutBottomFooter";

describe("GrailLayoutBottomFooter", () => {
  test("renders the footer root with the base class", () => {
    const fixture = TestBed.createComponent(GrailLayoutBottomFooter);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("footer.grail-layout-bottom-footer");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(GrailLayoutBottomFooter);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("footer.grail-layout-bottom-footer");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
