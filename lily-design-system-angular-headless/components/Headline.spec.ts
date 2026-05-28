import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Headline } from "./Headline";

describe("Headline", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Headline);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.headline");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Headline);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.headline");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
