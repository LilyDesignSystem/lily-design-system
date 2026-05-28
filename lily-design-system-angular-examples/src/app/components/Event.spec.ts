import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Event } from "./Event";

describe("Event", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Event);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.event");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Event);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.event");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
