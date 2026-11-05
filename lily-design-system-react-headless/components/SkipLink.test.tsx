import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./SkipLink";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

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

    test("has no English text of its own", () => {
        render(<Subject />);
        expect(screen.getByRole("link").textContent?.trim()).toBe("");
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
