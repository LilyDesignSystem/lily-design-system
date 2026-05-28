import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FileDialog } from "./FileDialog";

describe("FileDialog", () => {
  test("renders the dialog root with the base class", () => {
    const fixture = TestBed.createComponent(FileDialog);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.file-dialog");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FileDialog);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("dialog.file-dialog");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
