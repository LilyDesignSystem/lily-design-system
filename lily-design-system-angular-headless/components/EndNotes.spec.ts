import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EndNotes } from "./EndNotes";

describe("EndNotes", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(EndNotes);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.end-notes");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EndNotes);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.end-notes");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
