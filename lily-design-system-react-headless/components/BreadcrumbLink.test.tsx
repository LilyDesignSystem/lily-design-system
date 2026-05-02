import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbLink";

describe("BreadcrumbLink", () => {
    test("renders an anchor with href", () => {
        render(<Subject href="/x">Click</Subject>);
        const link = screen.getByRole("link", { name: "Click" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/x");
    });

    test("applies class breadcrumb-link", () => {
        render(<Subject href="/x">Click</Subject>);
        const link = screen.getByRole("link");
        expect(link.getAttribute("class")).toContain("breadcrumb-link");
    });

    test("applies aria-label when label prop is provided", () => {
        render(<Subject href="/x" label="More info">Click</Subject>);
        const link = screen.getByRole("link", { name: "More info" });
        expect(link.getAttribute("aria-label")).toBe("More info");
    });

    test("does not set aria-label when label prop is omitted", () => {
        render(<Subject href="/x">Click</Subject>);
        const link = screen.getByRole("link");
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject href="/x" data-testid="link">Click</Subject>);
        expect(screen.getByTestId("link")).toBeTruthy();
    });
});
