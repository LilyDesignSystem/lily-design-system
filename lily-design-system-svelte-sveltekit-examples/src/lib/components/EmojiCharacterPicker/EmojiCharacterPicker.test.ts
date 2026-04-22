import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EmojiCharacterPicker from "./EmojiCharacterPicker.svelte";

describe("EmojiCharacterPicker", () => {
    test("renders the component", () => {
        render(EmojiCharacterPicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
