import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Sparkline";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("Sparkline", () => {
    test("renders img role", () => {
        render(<Subject label="Trend">chart</Subject>);
        expect(screen.getByRole("img")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(<Subject label="Price trend">chart</Subject>);
        expect(screen.getByLabelText("Price trend")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="sl"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sl")).toBeTruthy();
    });
});
