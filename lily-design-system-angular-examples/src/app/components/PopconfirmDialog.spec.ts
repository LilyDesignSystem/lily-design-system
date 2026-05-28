import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PopconfirmDialog } from "./PopconfirmDialog";

describe("PopconfirmDialog", () => {
  test("renders the dialog root with the base class", () => {
    const fixture = TestBed.createComponent(PopconfirmDialog);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.popconfirm-dialog");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PopconfirmDialog);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.popconfirm-dialog");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
