import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { EmojiCharacterRadioGroup } from "./EmojiCharacterRadioGroup";

@Component({
    imports: [EmojiCharacterRadioGroup],
    template: `<lily-emoji-character-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-emoji-character-radio-group>`,
})
class Host0 {}

describe("EmojiCharacterRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        TestBed.createComponent(Host0).detectChanges();
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
