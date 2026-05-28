import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TabBar } from "./TabBar";

describe("TabBar", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TabBar);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tab-bar");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TabBar);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tab-bar");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
