import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TagGroup";

describe("TagGroup", () => {
    test("renders a group", () => {
        render(<Subject label="Tags">content</Subject>);
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Technologies">content</Subject>);
        expect(screen.getByLabelText("Technologies")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Tags">Svelte</Subject>);
        expect(screen.getByText("Svelte")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="tg"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
