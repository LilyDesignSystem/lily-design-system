import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Footnote";

describe("Footnote", () => {
    test("renders with note role", () => {
        render(<Subject id="fn1">Source info</Subject>);
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("has correct id", () => {
        render(<Subject id="fn1">Source</Subject>);
        expect(document.getElementById("fn1")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject id="fn1">Citation text</Subject>);
        expect(screen.getByRole("note").textContent).toContain("Citation text");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                id="fn1"
                data-testid="fn"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("fn")).toBeTruthy();
    });
});
