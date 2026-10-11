import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FileInput } from "./FileInput";

describe("FileInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(FileInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.file-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FileInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.file-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  // Guards the canonical type from components/{slug}/AGENTS.md — every
  // typed input in this library once rendered type="text" (fixed
  // 2026-08-26), and nothing asserted otherwise.
  test('renders the canonical input type "file"', () => {
    const fixture = TestBed.createComponent(FileInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.file-input");
    expect(el.getAttribute("type")).toBe("file");
  });
});
