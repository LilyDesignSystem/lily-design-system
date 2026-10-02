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

    // The skip link lives once in app/layout.tsx (moved there in bdab1862e)
    // and e2e/responsive.spec.ts checks it on every route. The page must not
    // render a second one: two skip links per document is an a11y defect.
    test("does not duplicate the layout's skip link", () => {
        render(<PageLayoutPage />);
        expect(screen.queryByText("Skip to main content")).toBeNull();
    });

    test("renders main content area", () => {
        render(<PageLayoutPage />);
        expect(screen.getByRole("main")).toBeTruthy();
    });
});
