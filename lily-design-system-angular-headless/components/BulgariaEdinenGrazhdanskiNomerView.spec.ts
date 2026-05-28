import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BulgariaEdinenGrazhdanskiNomerView } from "./BulgariaEdinenGrazhdanskiNomerView";

describe("BulgariaEdinenGrazhdanskiNomerView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(BulgariaEdinenGrazhdanskiNomerView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.bulgaria-edinen-grazhdanski-nomer-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BulgariaEdinenGrazhdanskiNomerView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.bulgaria-edinen-grazhdanski-nomer-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
