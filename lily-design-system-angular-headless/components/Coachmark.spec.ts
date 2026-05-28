import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Coachmark } from "./Coachmark";

describe("Coachmark", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Coachmark);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.coachmark");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Coachmark);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.coachmark");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
