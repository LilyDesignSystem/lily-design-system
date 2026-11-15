import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { EmojiCharacterRadioInput } from "./emoji-character-radio-input.js";

if (!customElements.get("lily-emoji-character-radio-input"))
    customElements.define("lily-emoji-character-radio-input", EmojiCharacterRadioInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("EmojiCharacterRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        document.body.innerHTML =
            '<lily-emoji-character-radio-input label="Yes" name="choice"></lily-emoji-character-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.emoji-character-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-emoji-character-radio-input label="Yes" name="choice" disabled></lily-emoji-character-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
