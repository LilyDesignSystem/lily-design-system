import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ProgressCircle";

describe("ProgressCircle", () => {
    test("renders with progressbar role", () => {
        render(<Subject label="Loading" />);
        expect(screen.getByRole("progressbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Upload progress" />);
        expect(screen.getByLabelText("Upload progress")).toBeTruthy();
    });

    test("sets aria-valuenow", () => {
        render(
            <Subject
                label="P"
                value={75}
            />,
        );
        expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("75");
    });

    test("sets aria-valuemin and aria-valuemax", () => {
        render(
            <Subject
                label="P"
                min={0}
                max={200}
            />,
        );
        const el = screen.getByRole("progressbar");
        expect(el.getAttribute("aria-valuemin")).toBe("0");
        expect(el.getAttribute("aria-valuemax")).toBe("200");
    });

    test("renders children", () => {
        render(<Subject label="P">75%</Subject>);
        expect(screen.getByRole("progressbar").textContent).toContain("75%");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="pc"
            />,
        );
        expect(screen.getByTestId("pc")).toBeTruthy();
    });
});
