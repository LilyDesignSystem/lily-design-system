import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EmailLink";

describe("EmailLink", () => {
    test("renders as a link", () => {
        render(<Subject email="alice@example.com" />);
        expect(screen.getByRole("link")).toBeTruthy();
    });

    test("displays the email address", () => {
        render(<Subject email="alice@example.com" />);
        expect(screen.getByText("alice@example.com")).toBeTruthy();
    });

    test("links to mailto", () => {
        render(<Subject email="alice@example.com" />);
        expect(screen.getByRole("link").getAttribute("href")).toBe("mailto:alice@example.com");
    });

    test("supports custom aria-label", () => {
        render(
            <Subject
                email="a@b.com"
                label="Email Alice"
            />,
        );
        expect(screen.getByRole("link").getAttribute("aria-label")).toBe("Email Alice");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                email="a@b.com"
                data-testid="eav"
            />,
        );
        expect(screen.getByTestId("eav")).toBeTruthy();
    });
});
