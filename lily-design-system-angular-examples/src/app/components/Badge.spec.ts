import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Badge } from "./Badge";

describe("Badge", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.badge");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.badge");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
