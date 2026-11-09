import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Card";

describe("Card", () => {
    test("renders a div with no role when unlabelled", () => {
        render(<Subject>Card content</Subject>);

        const article = document.querySelector(".card") as HTMLElement;
        expect(article.tagName).toBe("DIV");
        expect(article.hasAttribute("role")).toBe(false);
        expect(article.textContent).toContain("Card content");
    });

    test("renders heading when provided", () => {
        render(<Subject heading="My Card">Content</Subject>);

        const heading = screen.getByRole("heading", { name: "My Card" });
        expect(heading.tagName.toLowerCase()).toBe("h3");
    });

    test("renders heading with custom level", () => {
        render(
            <Subject
                heading="Section"
                headingLevel={2}
            >
                Content
            </Subject>,
        );

        expect(screen.getByRole("heading").tagName.toLowerCase()).toBe("h2");
    });

    test("renders heading as link when href provided", () => {
        render(
            <Subject
                heading="Product"
                href="/products/1"
            >
                Desc
            </Subject>,
        );

        const link = screen.getByRole("link", { name: "Product" });
        expect(link.getAttribute("href")).toBe("/products/1");
    });

    test("applies aria-label", () => {
        render(<Subject label="Featured card">Content</Subject>);

        expect(screen.getByRole("group", { name: "Featured card" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject data-testid="card">Content</Subject>);

        expect(screen.getByTestId("card")).toBeTruthy();
    });
});
