import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeSelect";

describe("ThemeSelect", () => {
    test("renders a select", () => {
        render(
            <Subject label="Theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </Subject>,
        );
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject label="Choose theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </Subject>,
        );
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("renders option children", () => {
        render(
            <Subject label="Theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </Subject>,
        );
        expect(screen.getByText("Light")).toBeTruthy();
        expect(screen.getByText("Dark")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="tc"
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </Subject>,
        );
        expect(screen.getByTestId("tc")).toBeTruthy();
    });
});
