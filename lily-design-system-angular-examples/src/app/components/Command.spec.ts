import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Command } from "./Command";

describe("Command", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Command);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.command");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Command);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.command");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
