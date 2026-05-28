import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TimeoutDialog } from "./TimeoutDialog";

describe("TimeoutDialog", () => {
  test("renders the dialog root with the base class", () => {
    const fixture = TestBed.createComponent(TimeoutDialog);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.timeout-dialog");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TimeoutDialog);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.timeout-dialog");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
