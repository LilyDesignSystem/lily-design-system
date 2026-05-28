import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextAreaInputWithCharacterCounter } from "./TextAreaInputWithCharacterCounter";

describe("TextAreaInputWithCharacterCounter", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TextAreaInputWithCharacterCounter);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.text-area-input-with-character-counter");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TextAreaInputWithCharacterCounter);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.text-area-input-with-character-counter");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
