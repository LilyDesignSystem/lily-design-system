import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FeatureCard";

describe("FeatureCard", () => {
    test("renders as an article with the heading as aria-label by default", () => {
        render(<Subject heading="Privacy first" />);

        const article: HTMLElement = screen.getByRole("article", {
            name: "Privacy first",
        });
        expect(article).toBeTruthy();
    });

    test("applies the feature-card root class", () => {
        render(<Subject heading="Privacy first" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.className.includes("feature-card")).toBe(true);
    });

    test("renders the heading inside an h3", () => {
        render(<Subject heading="Privacy first" />);

        const h3: HTMLElement = screen.getByRole("heading", {
            level: 3,
            name: "Privacy first",
        });
        expect(h3).toBeTruthy();
        expect(h3.className.includes("feature-card-heading")).toBe(true);
    });

    test("defaults imagePosition to start", () => {
        render(<Subject heading="Heading" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.getAttribute("data-image-position")).toBe("start");
    });

    test("respects imagePosition prop", () => {
        render(<Subject heading="Heading" imagePosition="top" />);

        const article: HTMLElement = screen.getByRole("article");
        expect(article.getAttribute("data-image-position")).toBe("top");
    });

    test("renders the image when imageUrl is provided", () => {
        const { container } = render(
            <Subject
                heading="Heading"
                imageUrl="/img.png"
                imageAlt="Alt text"
            />,
        );

        const img = container.querySelector("img");
        expect(img).toBeTruthy();
        expect(img!.getAttribute("src")).toBe("/img.png");
        expect(img!.getAttribute("alt")).toBe("Alt text");
        expect(img!.className.includes("feature-card-image")).toBe(true);
    });

    test("does not render an image when imageUrl is omitted", () => {
        const { container } = render(<Subject heading="Heading" />);

        expect(container.querySelector("img")).toBeNull();
    });

    test("renders a description paragraph when provided", () => {
        const { container } = render(
            <Subject heading="Heading" description="Body text" />,
        );

        const p = container.querySelector("p.feature-card-description");
        expect(p).toBeTruthy();
        expect(p!.textContent).toBe("Body text");
    });

    test("does not render a description when omitted", () => {
        const { container } = render(<Subject heading="Heading" />);

        expect(container.querySelector("p.feature-card-description")).toBeNull();
    });

    test("renders children content", () => {
        render(
            <Subject heading="Heading">
                <a href="/x">Learn more</a>
            </Subject>,
        );

        const link = screen.getByRole("link", { name: "Learn more" });
        expect(link).toBeTruthy();
    });

    test("uses label when provided in place of heading for aria-label", () => {
        render(<Subject heading="H" label="Custom label" />);

        const article: HTMLElement = screen.getByRole("article", {
            name: "Custom label",
        });
        expect(article).toBeTruthy();
    });
});
