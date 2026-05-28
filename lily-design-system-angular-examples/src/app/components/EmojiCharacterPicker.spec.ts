import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EmojiCharacterPicker } from "./EmojiCharacterPicker";

describe("EmojiCharacterPicker", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(EmojiCharacterPicker);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.emoji-character-picker");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EmojiCharacterPicker);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.emoji-character-picker");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
