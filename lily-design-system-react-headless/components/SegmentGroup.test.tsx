import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SegmentGroup";

describe("SegmentGroup", () => {
    test("renders a radiogroup", () => {
        render(<Subject label="View">content</Subject>);
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="View mode">content</Subject>);
        expect(screen.getByLabelText("View mode")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="View">Grid</Subject>);
        expect(screen.getByText("Grid")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="V"
                data-testid="sg"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sg")).toBeTruthy();
    });
});
