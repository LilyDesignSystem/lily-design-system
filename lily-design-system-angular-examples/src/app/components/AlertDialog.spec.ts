import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AlertDialog } from "./AlertDialog";

describe("AlertDialog", () => {
  test("renders the dialog root with the base class", () => {
    const fixture = TestBed.createComponent(AlertDialog);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.alert-dialog");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AlertDialog);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.alert-dialog");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
