import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SkipLink";

describe("SkipLink", () => {
    test("renders a link", () => {
        render(<Subject />);
        expect(screen.getByRole("link")).toBeTruthy();
    });

    test("has default href #content", () => {
        render(<Subject />);
        expect((screen.getByRole("link") as HTMLAnchorElement).getAttribute("href")).toBe(
            "#content",
        );
    });

    test("has default label text", () => {
        render(<Subject />);
        expect(screen.getByText("Skip to content")).toBeTruthy();
    });

    test("supports custom href", () => {
        render(<Subject href="#main" />);
        expect((screen.getByRole("link") as HTMLAnchorElement).getAttribute("href")).toBe("#main");
    });

    test("supports custom label", () => {
        render(<Subject label="Jump to main" />);
        expect(screen.getByText("Jump to main")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="sl" />);
        expect(screen.getByTestId("sl")).toBeTruthy();
    });
});
