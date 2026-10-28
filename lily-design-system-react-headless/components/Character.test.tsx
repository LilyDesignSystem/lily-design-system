import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Character";

describe("Character", () => {
    test("renders with img role and aria-label", () => {
        render(<Subject label="Check mark">✓</Subject>);

        const el = screen.getByRole("img", { name: "Check mark" });
        expect(el).toBeTruthy();
        expect(el.textContent).toContain("✓");
    });

    test("is aria-hidden when decorative", () => {
        render(
            <Subject
                decorative
                data-testid="char"
            >
                ★
            </Subject>,
        );

        const el = screen.getByTestId("char");
        expect(el.getAttribute("aria-hidden")).toBe("true");
        expect(el.getAttribute("role")).toBe("presentation");
    });

    test("does not have aria-hidden when not decorative", () => {
        render(<Subject label="Star">★</Subject>);

        const el = screen.getByRole("img");
        expect(el.getAttribute("aria-hidden")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Test"
                data-testid="char"
            >
                X
            </Subject>,
        );

        expect(screen.getByTestId("char")).toBeTruthy();
    });
});
