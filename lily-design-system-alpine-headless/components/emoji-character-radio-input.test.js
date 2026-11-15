// emoji-character-radio-input.test.js
// EmojiCharacterRadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.emoji-character-radio-input");

describe("EmojiCharacterRadioInput", () => {
    it("renders the element with its base class", async () => {
        await mount("emoji-character-radio-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("emoji-character-radio-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("emoji-character-radio-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
