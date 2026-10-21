// emoji-character-picker.test.js
// EmojiCharacterPicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.emoji-character-picker");


describe("EmojiCharacterPicker", () => {
  it("renders the element with its base class", async () => {
    await mount("emoji-character-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("emoji-character-picker")).toBe(true);
  });

  it('is role="grid" with an accessible name', async () => {
    await mount("emoji-character-picker");
    expect(el().getAttribute("role")).toBe("grid");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
