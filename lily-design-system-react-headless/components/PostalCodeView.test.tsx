import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PostalCodeView";

describe("PostalCodeView", () => {
    test("renders a span", () => {
        render(
            <Subject
                text="90210"
                data-testid="pc"
            />,
        );
        const el = screen.getByTestId("pc");
        expect(el.tagName).toBe("SPAN");
    });

    test("displays the postal code text", () => {
        render(
            <Subject
                text="90210"
                data-testid="pc"
            />,
        );
        expect(screen.getByTestId("pc").textContent).toBe("90210");
    });

    test("renders empty when no text provided", () => {
        render(<Subject data-testid="pc" />);
        expect(screen.getByTestId("pc").textContent).toBe("");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                text="12345"
                data-testid="pc"
            />,
        );
        expect(screen.getByTestId("pc")).toBeTruthy();
    });
});
