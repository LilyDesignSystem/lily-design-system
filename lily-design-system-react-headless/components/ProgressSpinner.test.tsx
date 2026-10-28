import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ProgressSpinner";

describe("ProgressSpinner", () => {
    test("renders with status role", () => {
        render(<Subject label="Loading" />);
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Loading data" />);
        expect(screen.getByLabelText("Loading data")).toBeTruthy();
    });

    test("has polite aria-live", () => {
        render(
            <Subject
                label="Loading"
                data-testid="ps"
            />,
        );
        expect(screen.getByTestId("ps").getAttribute("aria-live")).toBe("polite");
    });

    test("renders children", () => {
        render(<Subject label="L">Please wait</Subject>);
        expect(screen.getByRole("status").textContent).toContain("Please wait");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="L"
                data-testid="ps"
            />,
        );
        expect(screen.getByTestId("ps")).toBeTruthy();
    });
});
