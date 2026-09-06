import { afterEach, describe, expect, test } from "vitest";

import { EmojiCharacterPicker } from "./emoji-character-picker.js";

if (!customElements.get("lily-emoji-character-picker")) {
    customElements.define("lily-emoji-character-picker", EmojiCharacterPicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EmojiCharacterPicker", () => {
    test("carries the base class", () => {
        const host = render('<lily-emoji-character-picker label="Choose an emoji"></lily-emoji-character-picker>');

        expect(host.classList.contains("emoji-character-picker")).toBe(true);
    });

    test("has role=grid", () => {
        const host = render('<lily-emoji-character-picker label="Choose an emoji"></lily-emoji-character-picker>');

        expect(host.getAttribute("role")).toBe("grid");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-emoji-character-picker label="Choose an emoji"></lily-emoji-character-picker>');

        expect(host.getAttribute("aria-label")).toBe("Choose an emoji");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-emoji-character-picker label="Choose an emoji" class="my-picker"></lily-emoji-character-picker>',
        );

        expect(host.getAttribute("class")).toBe("emoji-character-picker my-picker");
    });

    test("keeps consumer-supplied grid content in place", () => {
        const host = render(
            '<lily-emoji-character-picker label="Choose an emoji"><div role="row"><button role="gridcell">\u{1F600}</button></div></lily-emoji-character-picker>',
        );

        expect(host.querySelector('[role="gridcell"]')).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render('<lily-emoji-character-picker label="Choose an emoji"></lily-emoji-character-picker>');

        (host as unknown as EmojiCharacterPicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("grid");
        expect(host.getAttribute("aria-label")).toBe("Choose an emoji");
    });
});
