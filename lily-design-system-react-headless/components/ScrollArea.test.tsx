import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollArea";

describe("ScrollArea", () => {
    test("renders a region", () => {
        render(<Subject label="Content">text</Subject>);
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Scrollable">text</Subject>);
        expect(screen.getByLabelText("Scrollable")).toBeTruthy();
    });

    test("has tabindex for keyboard scrolling", () => {
        render(<Subject label="Content">text</Subject>);
        expect(screen.getByRole("region").getAttribute("tabindex")).toBe("0");
    });

    test("renders children", () => {
        render(<Subject label="Content">Long text</Subject>);
        expect(screen.getByText("Long text")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="C"
                data-testid="sa"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sa")).toBeTruthy();
    });
});
