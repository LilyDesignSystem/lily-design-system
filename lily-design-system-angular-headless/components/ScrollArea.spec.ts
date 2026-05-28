import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ScrollArea);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroll-area");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ScrollArea);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.scroll-area");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
