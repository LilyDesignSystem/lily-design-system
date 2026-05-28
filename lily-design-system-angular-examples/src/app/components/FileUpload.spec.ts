import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(FileUpload);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.file-upload");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(FileUpload);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.file-upload");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
