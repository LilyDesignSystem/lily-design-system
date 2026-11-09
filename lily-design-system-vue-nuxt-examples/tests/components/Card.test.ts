import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Card.vue";

describe("Card", () => {
    test("renders a div with no role when unlabelled", () => {
        render(Subject, { slots: { default: "Card content" } });

        const article = document.querySelector(".card") as HTMLElement;
        expect(article.tagName).toBe("DIV");
        expect(article.hasAttribute("role")).toBe(false);
        expect(article.textContent).toContain("Card content");
    });

    test("renders heading when provided", () => {
        render(Subject, { props: { heading: "My Card" }, slots: { default: "Content" } });

        const heading = screen.getByRole("heading", { name: "My Card" });
        expect(heading.tagName.toLowerCase()).toBe("h3");
    });

    test("renders heading with custom level", () => {
        render(Subject, {
            props: { heading: "Section", headingLevel: 2 },
            slots: { default: "Content" },
        });

        expect(screen.getByRole("heading").tagName.toLowerCase()).toBe("h2");
    });

    test("renders heading as link when href provided", () => {
        render(Subject, {
            props: { heading: "Product", href: "/products/1" },
            slots: { default: "Desc" },
        });

        const link = screen.getByRole("link", { name: "Product" });
        expect(link.getAttribute("href")).toBe("/products/1");
    });

    test("applies aria-label", () => {
        render(Subject, { props: { label: "Featured card" }, slots: { default: "Content" } });

        expect(screen.getByRole("group", { name: "Featured card" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "card" }, slots: { default: "Content" } });

        expect(screen.getByTestId("card")).toBeTruthy();
    });
});
