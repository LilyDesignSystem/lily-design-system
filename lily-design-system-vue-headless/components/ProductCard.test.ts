import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ProductCard.vue";


describe("ProductCard", () => {
    test("renders as an <article>", () => {
        const { container } = render(Subject, {
            props: { name: "Widget", price: "$9.99" },
        });

        const el = container.querySelector("article");
        expect(el).toBeTruthy();
    });

    test("has product-card class on root", () => {
        const { container } = render(Subject, {
            props: { name: "Widget", price: "$9.99" },
        });

        const el = container.querySelector("article");
        expect(el?.classList.contains("product-card")).toBe(true);
    });

    test("renders the name in an h3", () => {
        render(Subject, { props: { name: "Wonder Widget", price: "$19.99" } });

        const heading: HTMLElement = screen.getByRole("heading", { level: 3 });
        expect(heading.textContent).toBe("Wonder Widget");
    });

    test("renders the price text", () => {
        render(Subject, { props: { name: "Widget", price: "$19.99" } });

        expect(screen.getByText("$19.99")).toBeTruthy();
    });

    test("aria-label defaults to name", () => {
        const { container } = render(Subject, {
            props: { name: "Widget", price: "$9.99" },
        });

        const el = container.querySelector("article");
        expect(el?.getAttribute("aria-label")).toBe("Widget");
    });

    test("aria-label can be overridden", () => {
        const { container } = render(Subject, {
            props: { name: "Widget", price: "$9.99", label: "Featured product" },
        });

        const el = container.querySelector("article");
        expect(el?.getAttribute("aria-label")).toBe("Featured product");
    });

    test("renders image when imageUrl is provided", () => {
        const { container } = render(Subject, {
            props: {
                name: "Widget",
                price: "$9.99",
                imageUrl: "/widget.jpg",
                imageAlt: "Widget photo",
            },
        });

        const img = container.querySelector("img.product-card-image");
        expect(img).toBeTruthy();
        expect(img?.getAttribute("src")).toBe("/widget.jpg");
        expect(img?.getAttribute("alt")).toBe("Widget photo");
    });

    test("does not render image when imageUrl is missing", () => {
        const { container } = render(Subject, {
            props: { name: "Widget", price: "$9.99" },
        });

        expect(container.querySelector("img.product-card-image")).toBeNull();
    });

    test("renders default slot content", () => {
        render(Subject, {
            props: { name: "Widget", price: "$9.99" },
            slots: { default: "<p>A wondrous widget</p>" },
        });

        expect(screen.getByText("A wondrous widget")).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { name: "Widget", price: "$9.99", id: "p-1" },
        });

        const el = container.querySelector("article");
        expect(el?.getAttribute("id")).toBe("p-1");
    });
});
