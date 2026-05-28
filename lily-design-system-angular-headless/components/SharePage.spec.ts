import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SharePage } from "./SharePage";

describe("SharePage", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(SharePage);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.share-page");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SharePage);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.share-page");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
