import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Dialog } from "./Dialog";

describe("Dialog", () => {
  test("renders the dialog root with the base class", () => {
    const fixture = TestBed.createComponent(Dialog);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.dialog");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Dialog);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.dialog");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
