import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BannerBox } from "./BannerBox";

describe("BannerBox", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(BannerBox);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.banner-box");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BannerBox);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.banner-box");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
