import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Notification";

describe("Notification", () => {
    test("renders with status role by default", () => {
        render(<Subject>Saved</Subject>);
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("renders with alert role when urgent", () => {
        render(<Subject urgent>Error</Subject>);
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("has polite live region by default", () => {
        render(<Subject data-testid="n">Info</Subject>);
        expect(screen.getByTestId("n").getAttribute("aria-live")).toBe("polite");
    });

    test("has assertive live region when urgent", () => {
        render(
            <Subject
                urgent
                data-testid="n"
            >
                E
            </Subject>,
        );
        expect(screen.getByTestId("n").getAttribute("aria-live")).toBe("assertive");
    });

    test("renders children", () => {
        render(<Subject>Changes saved</Subject>);
        expect(screen.getByRole("status").textContent).toContain("Changes saved");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="n">C</Subject>);
        expect(screen.getByTestId("n")).toBeTruthy();
    });
});
