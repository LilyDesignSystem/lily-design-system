import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollBar";

describe("ScrollBar", () => {
    test("renders a scrollbar", () => {
        render(<Subject label="Scroll">thumb</Subject>);
        expect(screen.getByRole("scrollbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Page scroll">thumb</Subject>);
        expect(screen.getByLabelText("Page scroll")).toBeTruthy();
    });

    test("defaults to vertical orientation", () => {
        render(<Subject label="Scroll">thumb</Subject>);
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("vertical");
    });

    test("supports horizontal orientation", () => {
        render(
            <Subject
                label="Scroll"
                orientation="horizontal"
            >
                thumb
            </Subject>,
        );
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="sb"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sb")).toBeTruthy();
    });
});
