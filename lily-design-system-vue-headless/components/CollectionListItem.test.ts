import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CollectionListItem.vue";


describe("CollectionListItem", () => {
    test("renders as an li element", () => {
        const { container } = render(Subject, { props: { heading: "Hello" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li).toBeTruthy();
    });

    test("has collection-list-item class on root", () => {
        const { container } = render(Subject, { props: { heading: "Hello" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.classList.contains("collection-list-item")).toBe(true);
    });

    test("renders heading text", () => {
        render(Subject, { props: { heading: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("wraps heading in an anchor when href is provided", () => {
        render(Subject, { props: { heading: "Hello", href: "/x" } });

        const link: HTMLAnchorElement = screen.getByRole("link") as HTMLAnchorElement;
        expect(link.getAttribute("href")).toBe("/x");
        expect(link.textContent).toBe("Hello");
    });

    test("does not wrap heading in an anchor when href is missing", () => {
        const { container } = render(Subject, { props: { heading: "Hello" } });

        const link: HTMLAnchorElement | null = container.querySelector("a");
        expect(link).toBeNull();
    });

    test("renders meta when provided", () => {
        render(Subject, { props: { heading: "Hello", meta: "Jan 1" } });

        expect(screen.getByText("Jan 1")).toBeTruthy();
    });

    test("renders description when provided", () => {
        render(Subject, { props: { heading: "Hello", description: "Some text" } });

        expect(screen.getByText("Some text")).toBeTruthy();
    });

    test("renders image when imageUrl is provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Hello", imageUrl: "/x.png", imageAlt: "x" },
        });

        const img: HTMLImageElement | null = container.querySelector("img");
        expect(img).toBeTruthy();
        expect(img?.getAttribute("src")).toBe("/x.png");
        expect(img?.getAttribute("alt")).toBe("x");
    });

    test("does not render image when imageUrl is missing", () => {
        const { container } = render(Subject, { props: { heading: "Hello" } });

        const img: HTMLImageElement | null = container.querySelector("img");
        expect(img).toBeNull();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, { props: { heading: "Hello", label: "Article one" } });

        const li: HTMLElement | null = container.querySelector("li");
        expect(li?.getAttribute("aria-label")).toBe("Article one");
    });

    test("renders default slot content", () => {
        render(Subject, {
            props: { heading: "Hello" },
            slots: { default: "<span>extra</span>" },
        });

        expect(screen.getByText("extra")).toBeTruthy();
    });
});
