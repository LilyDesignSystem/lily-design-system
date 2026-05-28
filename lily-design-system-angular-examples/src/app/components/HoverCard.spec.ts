import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HoverCard } from "./HoverCard";

describe("HoverCard", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(HoverCard);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hover-card");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(HoverCard);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.hover-card");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
