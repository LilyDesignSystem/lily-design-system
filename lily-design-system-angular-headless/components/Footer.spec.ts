import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Footer } from "./Footer";

describe("Footer", () => {
  test("renders the footer root with the base class", () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("footer.footer");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("footer.footer");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
