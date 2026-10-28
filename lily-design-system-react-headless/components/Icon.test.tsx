import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Icon";
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}
describe("Icon", () => {
    test("meaningful icon has img role", () => {
        render(<Subject label="Close">×</Subject>);
        expect(screen.getByRole("img", { name: "Close" })).toBeTruthy();
    });
    test("decorative icon is aria-hidden", () => {
        render(
            <Subject
                decorative
                data-testid="ic"
            >
                ★
            </Subject>,
        );
        expect(screen.getByTestId("ic").getAttribute("aria-hidden")).toBe("true");
    });
    test("renders children", () => {
        render(<Subject label="Star">★</Subject>);
        expect(screen.getByRole("img").textContent).toBe("★");
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="X"
                data-testid="ic"
            >
                ×
            </Subject>,
        );
        expect(screen.getByTestId("ic")).toBeTruthy();
    });
});
