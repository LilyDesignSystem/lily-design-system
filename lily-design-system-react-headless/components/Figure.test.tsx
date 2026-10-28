import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Figure";
describe("Figure", () => {
    test("renders img role", () => {
        render(<Subject label="Sales">bars</Subject>);
        expect(screen.getByRole("img")).toBeTruthy();
    });
    test("uses figure element", () => {
        render(<Subject label="Sales">bars</Subject>);
        expect(screen.getByRole("img").tagName).toBe("FIGURE");
    });
    test("has aria-label", () => {
        render(<Subject label="Monthly sales">bars</Subject>);
        expect(screen.getByLabelText("Monthly sales")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="C"
                data-testid="ch"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("ch")).toBeTruthy();
    });
});
