import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Resizable";

describe("Resizable", () => {
    test("renders a region", () => {
        render(<Subject label="Panel">content</Subject>);
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Resizable panel">content</Subject>);
        expect(screen.getByLabelText("Resizable panel")).toBeTruthy();
    });

    test("defaults to both direction", () => {
        render(<Subject label="Panel">content</Subject>);
        expect(screen.getByRole("region").getAttribute("data-resize")).toBe("both");
    });

    test("supports horizontal direction", () => {
        render(
            <Subject
                label="Panel"
                direction="horizontal"
            >
                x
            </Subject>,
        );
        expect(screen.getByRole("region").getAttribute("data-resize")).toBe("horizontal");
    });

    test("is keyboard focusable", () => {
        render(<Subject label="Panel">content</Subject>);
        expect(screen.getByRole("region").getAttribute("tabindex")).toBe("0");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="rs"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("rs")).toBeTruthy();
    });
});
