import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AvatarText";

describe("AvatarText", () => {
    test("renders a span element", () => {
        render(<Subject data-testid="act">JD</Subject>);
        expect(screen.getByTestId("act").tagName).toBe("SPAN");
    });

    test("renders children text", () => {
        render(<Subject>AB</Subject>);
        expect(screen.getByText("AB")).toBeTruthy();
    });

    test("is aria-hidden", () => {
        render(<Subject data-testid="act">JD</Subject>);
        expect(screen.getByTestId("act").getAttribute("aria-hidden")).toBe("true");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="initials">X</Subject>);
        expect(screen.getByTestId("initials")).toBeTruthy();
    });
});
