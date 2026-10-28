import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Badge";

describe("Badge", () => {
    test("renders with status role", () => {
        render(<Subject>New</Subject>);

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain("New");
    });

    test("defaults to type default", () => {
        render(<Subject>Badge</Subject>);

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("default");
    });

    test("applies custom type", () => {
        render(<Subject type="error">Error</Subject>);

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("error");
    });

    test("applies aria-label when label prop is provided", () => {
        render(<Subject label="3 unread messages">3</Subject>);

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBe("3 unread messages");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(<Subject>Info</Subject>);

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                data-testid="my-badge"
                id="badge-1"
            >
                Tag
            </Subject>,
        );

        const badge: HTMLElement = screen.getByTestId("my-badge");
        expect(badge.getAttribute("id")).toBe("badge-1");
    });
});
