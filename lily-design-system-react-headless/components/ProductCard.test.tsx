import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ProductCard";

describe("ProductCard", () => {
    test("renders an <article> with the product-card class", () => {
        render(<Subject name="Lamp" price="$49.00" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.tagName).toBe("ARTICLE");
        expect(article.className.includes("product-card")).toBe(true);
    });

    test("renders the name as a heading", () => {
        render(<Subject name="Lamp" price="$49.00" />);

        const heading: HTMLElement = screen.getByRole("heading", { level: 3 });
        expect(heading.textContent).toBe("Lamp");
        expect(heading.className).toBe("product-card-name");
    });

    test("renders the pre-formatted price", () => {
        render(<Subject name="Lamp" price="$49.00" />);

        const priceEl: HTMLElement | null = document.querySelector(".product-card-price");
        expect(priceEl?.textContent).toBe("$49.00");
    });

    test("aria-label defaults to name when label not provided", () => {
        render(<Subject name="Lamp" price="$49.00" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.getAttribute("aria-label")).toBe("Lamp");
    });

    test("aria-label override via label prop", () => {
        render(<Subject name="Lamp" price="$49.00" label="Brass reading lamp" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.getAttribute("aria-label")).toBe("Brass reading lamp");
    });

    test("renders an image when imageUrl is provided", () => {
        render(
            <Subject
                name="Lamp"
                price="$49.00"
                imageUrl="/lamp.jpg"
                imageAlt="Brass lamp"
            />,
        );

        const img: HTMLImageElement = screen.getByRole("img") as HTMLImageElement;
        expect(img.getAttribute("src")).toBe("/lamp.jpg");
        expect(img.getAttribute("alt")).toBe("Brass lamp");
        expect(img.className).toBe("product-card-image");
    });

    test("renders children after the header", () => {
        render(
            <Subject name="Lamp" price="$49.00">
                <button>Add to cart</button>
            </Subject>,
        );

        expect(screen.getByRole("button", { name: "Add to cart" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject name="Lamp" price="$49.00" id="lamp-1" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.getAttribute("id")).toBe("lamp-1");
    });
});
