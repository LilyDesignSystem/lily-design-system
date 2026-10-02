import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Badge from "@lily/Badge";

describe("Badge", () => {
    test("renders with status role", () => {
        render(<Badge>New</Badge>);
        const badge = screen.getByRole("status");
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain("New");
    });

    test("sets data-type attribute", () => {
        render(<Badge type="warning">Alert</Badge>);
        const badge = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("warning");
    });

    test("sets aria-label when provided", () => {
        render(<Badge label="3 unread messages">3</Badge>);
        const badge = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBe("3 unread messages");
    });

    test("defaults to default type", () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("default");
    });
});
