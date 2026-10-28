import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./SignaturePad";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("SignaturePad", () => {
    test("renders application role", () => {
        render(<Subject label="Signature">canvas</Subject>);
        expect(screen.getByRole("application")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(<Subject label="Sign here">canvas</Subject>);
        expect(screen.getByLabelText("Sign here")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="sp"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sp")).toBeTruthy();
    });
});
