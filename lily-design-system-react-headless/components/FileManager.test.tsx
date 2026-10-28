import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./FileManager";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("FileManager", () => {
    test("renders a region", () => {
        render(<Subject label="Files">content</Subject>);
        expect(screen.getByRole("region")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(<Subject label="File browser">content</Subject>);
        expect(screen.getByLabelText("File browser")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                data-testid="fm"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("fm")).toBeTruthy();
    });
});
