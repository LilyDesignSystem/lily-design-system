import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EditableForm } from "./EditableForm";

describe("EditableForm", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(EditableForm);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.editable-form");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EditableForm);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.editable-form");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
