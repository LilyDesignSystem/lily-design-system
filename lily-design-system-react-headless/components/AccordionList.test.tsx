import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AccordionList";

describe("AccordionList", () => {
    test("renders an ordered list", () => {
        render(<Subject>content</Subject>);
        expect(screen.getByRole("list").tagName).toBe("OL");
    });

    test("has aria-label when provided", () => {
        render(<Subject label="Questions">content</Subject>);
        expect(screen.getByLabelText("Questions")).toBeTruthy();
    });

    test("no aria-label when label is empty", () => {
        render(<Subject>content</Subject>);
        expect(screen.getByRole("list").getAttribute("aria-label")).toBeNull();
    });

    test("renders children", () => {
        render(<Subject>Items here</Subject>);
        expect(screen.getByText("Items here")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="al">x</Subject>);
        expect(screen.getByTestId("al")).toBeTruthy();
    });
});
