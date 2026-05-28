import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContextualHelp } from "./ContextualHelp";

describe("ContextualHelp", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ContextualHelp);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.contextual-help");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContextualHelp);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.contextual-help");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
