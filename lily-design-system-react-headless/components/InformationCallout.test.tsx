import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./InformationCallout";

describe("InformationCallout", () => {
    test("renders with note role", () => {
        render(<Subject label="Note">Info</Subject>);
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Important">C</Subject>);
        expect(screen.getByRole("note").getAttribute("aria-label")).toBe("Important");
    });

    test("renders children", () => {
        render(<Subject label="N">Beta feature</Subject>);
        expect(screen.getByRole("note").textContent).toContain("Beta feature");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="ic"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("ic")).toBeTruthy();
    });
});
