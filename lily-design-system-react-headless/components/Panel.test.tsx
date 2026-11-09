import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Panel";

describe("Panel", () => {
    test("renders as a named group", () => {
        render(<Subject label="Settings">Content</Subject>);
        expect(screen.getByRole("group", { name: "Settings" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Info">C</Subject>);
        expect(screen.getByRole("group").getAttribute("aria-label")).toBe("Info");
    });

    test("renders children", () => {
        render(<Subject label="P">Panel content</Subject>);
        expect(screen.getByRole("group").textContent).toContain("Panel content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="pn"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("pn")).toBeTruthy();
    });
});
