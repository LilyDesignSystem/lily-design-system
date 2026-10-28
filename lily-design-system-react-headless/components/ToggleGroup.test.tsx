import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ToggleGroup";

describe("ToggleGroup", () => {
    test("renders a group", () => {
        render(<Subject label="Format">content</Subject>);
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Format">content</Subject>);
        expect(screen.getByLabelText("Format")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Format">Bold</Subject>);
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                data-testid="tg"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
