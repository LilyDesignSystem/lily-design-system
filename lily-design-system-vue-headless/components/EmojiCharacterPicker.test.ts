import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./EmojiCharacterPicker.vue";
describe("EmojiCharacterPicker", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Emoji" }, slots: { default: "emojis" } });
        expect(screen.getByRole("group")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Pick emoji" }, slots: { default: "emojis" } });
        expect(screen.getByLabelText("Pick emoji")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "E", "data-testid": "ep" }, slots: { default: "x" } });
        expect(screen.getByTestId("ep")).toBeTruthy();
    });
});
