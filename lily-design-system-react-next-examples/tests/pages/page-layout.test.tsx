import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import PageLayoutPage from "../../app/page-layout/page";

describe("PageLayout", () => {
    test("renders header and footer", () => {
        render(<PageLayoutPage />);
        expect(screen.getByRole("banner")).toBeTruthy();
        expect(screen.getByRole("contentinfo")).toBeTruthy();
    });

    test("renders breadcrumb navigation", () => {
        render(<PageLayoutPage />);
        const breadcrumb = screen.getByLabelText("Breadcrumb");
        expect(breadcrumb).toBeTruthy();
    });

    test("renders skip link", () => {
        render(<PageLayoutPage />);
        const skipLink = screen.getByText("Skip to main content");
        expect(skipLink).toBeTruthy();
    });

    test("renders main content area", () => {
        render(<PageLayoutPage />);
        expect(screen.getByRole("main")).toBeTruthy();
    });
});
