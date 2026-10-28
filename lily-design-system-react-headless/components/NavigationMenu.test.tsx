import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NavigationMenu";

describe("NavigationMenu", () => {
    test("renders a navigation landmark", () => {
        render(<Subject label="Main">content</Subject>);
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Main navigation">content</Subject>);
        expect(screen.getByLabelText("Main navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Nav">Home</Subject>);
        expect(screen.getByText("Home")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="nm"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("nm")).toBeTruthy();
    });
});
