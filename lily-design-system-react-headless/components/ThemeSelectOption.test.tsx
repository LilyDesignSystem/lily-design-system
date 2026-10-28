import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeSelectOption";

describe("ThemeSelectOption", () => {
    test("renders an option element", () => {
        render(<Subject value="dark">Dark</Subject>);
        expect(screen.getByRole("option")).toBeTruthy();
    });

    test("has the correct value", () => {
        render(<Subject value="light">Light</Subject>);
        expect((screen.getByRole("option") as HTMLOptionElement).value).toBe("light");
    });

    test("renders children text", () => {
        render(<Subject value="dark">Dark Mode</Subject>);
        expect(screen.getByRole("option").textContent).toContain("Dark Mode");
    });

    test("supports selected", () => {
        render(
            <Subject
                value="dark"
                selected
            >
                Dark
            </Subject>,
        );
        expect((screen.getByRole("option") as HTMLOptionElement).selected).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                value="dark"
                disabled
            >
                Dark
            </Subject>,
        );
        expect((screen.getByRole("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value="dark"
                data-testid="tso"
            >
                Dark
            </Subject>,
        );
        expect(screen.getByTestId("tso")).toBeTruthy();
    });
});
