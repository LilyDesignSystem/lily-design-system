import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Field";

describe("Field", () => {
    test("renders label", () => {
        render(<Subject label="Name">input</Subject>);
        expect(screen.getByText("Name")).toBeTruthy();
    });

    test("renders description", () => {
        render(
            <Subject
                label="Name"
                description="Full name"
            >
                input
            </Subject>,
        );
        expect(screen.getByText("Full name")).toBeTruthy();
    });

    test("renders error with alert role", () => {
        render(
            <Subject
                label="Name"
                error="Required"
            >
                input
            </Subject>,
        );
        expect(screen.getByRole("alert").textContent).toBe("Required");
    });

    test("shows required indicator", () => {
        render(
            <Subject
                label="Name"
                required
            >
                input
            </Subject>,
        );
        expect(screen.getByText("*")).toBeTruthy();
    });

    test("required indicator is aria-hidden", () => {
        render(
            <Subject
                label="Name"
                required
            >
                input
            </Subject>,
        );
        expect(screen.getByText("*").closest("[aria-hidden]")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="f"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("f")).toBeTruthy();
    });
});
