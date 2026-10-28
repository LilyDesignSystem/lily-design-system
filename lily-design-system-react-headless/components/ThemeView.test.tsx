import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeView";

describe("ThemeView", () => {
    test("renders a span", () => {
        render(
            <Subject
                label="Theme"
                value="dark"
                data-testid="tv"
            />,
        );
        expect(screen.getByTestId("tv").tagName).toBe("SPAN");
    });

    test("displays the theme value", () => {
        render(
            <Subject
                label="Theme"
                value="dark"
            />,
        );
        expect(screen.getByText("dark")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="Current theme"
                value="light"
            />,
        );
        expect(screen.getByLabelText("Current theme")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                value="x"
                data-testid="tv"
            />,
        );
        expect(screen.getByTestId("tv")).toBeTruthy();
    });
});
