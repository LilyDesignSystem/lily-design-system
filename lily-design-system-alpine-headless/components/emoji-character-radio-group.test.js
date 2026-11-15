// emoji-character-radio-group.test.js
// EmojiCharacterRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.emoji-character-radio-group");

describe("EmojiCharacterRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("emoji-character-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("emoji-character-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("emoji-character-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});
