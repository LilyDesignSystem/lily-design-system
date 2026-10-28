import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./EmojiCharacterPicker";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("EmojiCharacterPicker", () => {
    test("renders a grid", () => {
        render(<Subject label="Emoji">emojis</Subject>);
        expect(screen.getByRole("grid")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(<Subject label="Pick emoji">emojis</Subject>);
        expect(screen.getByLabelText("Pick emoji")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="E"
                data-testid="ep"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("ep")).toBeTruthy();
    });
});
