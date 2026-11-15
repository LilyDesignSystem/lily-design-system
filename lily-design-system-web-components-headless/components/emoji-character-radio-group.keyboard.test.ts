import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { EmojiCharacterRadioGroup } from "./emoji-character-radio-group.js";

if (!customElements.get("lily-emoji-character-radio-group"))
    customElements.define("lily-emoji-character-radio-group", EmojiCharacterRadioGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("EmojiCharacterRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML =
            '<lily-emoji-character-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-emoji-character-radio-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".emoji-character-radio-group")?.getAttribute("aria-label")).toBe(
            "Size",
        );
        expect(first.closest(".emoji-character-radio-group")?.getAttribute("role")).toBe(
            "radiogroup",
        );
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
